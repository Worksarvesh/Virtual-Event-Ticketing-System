const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Configuration constants
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET || "bsbsfbrnsftentwnnwnwn";
const MONGODB_URI = process.env.MONGO_URL || "mongodb://localhost:27017/your_database_name";
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: process.env.CLIENT_URL || "http://localhost:5173",
   })
);

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Import routes
const eventRoutes = require('./routes/event');
const ticketRoutes = require('./routes/ticket');
const userRoutes = require('./routes/user');
const youtubeRoutes = require('./routes/youtube');
const analyticsRoutes = require('./routes/youtubeAnalytics');
const webinarRoutes = require('./routes/webinar');

// Use routes
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/webinars', webinarRoutes);

// Test route
app.get("/test", (req, res) => {
   res.json("test ok");
});

// User Registration
app.post("/register", async (req, res) => {
   const { name, email, password, role } = req.body;

   try {
      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
         role: role || 'attendee'
      });
      res.json(userDoc);
   } catch (e) {
      res.status(422).json(e);
   }
});

// User Login
app.post("/login", async (req, res) => {
   const { email, password } = req.body;

   try {
      const userDoc = await UserModel.findOne({ email });

      if (!userDoc) {
         return res.status(404).json({ error: "User not found" });
      }

      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (!passOk) {
         return res.status(401).json({ error: "Invalid password" });
      }

      jwt.sign(
         {
            email: userDoc.email,
            id: userDoc._id,
         },
         jwtSecret,
         {},
         (err, token) => {
            if (err) {
               return res.status(500).json({ error: "Failed to generate token" });
            }
            res.cookie("token", token).json(userDoc);
         }
      );
   } catch (error) {
      res.status(500).json({ error: "Server error" });
   }
});

// Get User Profile
app.get("/profile", async (req, res) => {
   const { token } = req.cookies;
   if (!token) {
      return res.json(null);
   }

   try {
      const userData = await jwt.verify(token, jwtSecret);
      const { name, email, _id, role } = await UserModel.findById(userData.id);
      res.json({ name, email, _id, role });
   } catch (error) {
      res.status(401).json({ error: "Invalid token" });
   }
});

// Logout
app.post("/logout", (req, res) => {
   res.cookie("token", "").json(true);
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});