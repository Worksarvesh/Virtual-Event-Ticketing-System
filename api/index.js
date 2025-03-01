const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const Ticket = require("./models/Ticket");

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

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadDir)) {
    require('fs').mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadDir);
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
   },
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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

// Test route
app.get("/test", (req, res) => {
   res.json("test ok");
});

// User Registration
app.post("/register", async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
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
      const { name, email, _id } = await UserModel.findById(userData.id);
      res.json({ name, email, _id });
   } catch (error) {
      res.status(401).json({ error: "Invalid token" });
   }
});

// Logout
app.post("/logout", (req, res) => {
   res.cookie("token", "").json(true);
});

// Event Schema
const eventSchema = new mongoose.Schema({
   owner: String,
   title: String,
   description: String,
   organizedBy: String,
   eventDate: Date,
   eventTime: String,
   location: String,
   Participants: Number,
   Count: Number,
   Income: Number,
   ticketPrice: Number,
   Quantity: Number,
   image: String,
   likes: { type: Number, default: 0 },
   Comment: [String],
});

const Event = mongoose.model("Event", eventSchema);

// Create Event
app.post("/createEvent", upload.single("image"), async (req, res) => {
   try {
      const eventData = req.body;
      eventData.image = req.file ? req.file.path : "";
      const newEvent = new Event(eventData);
      await newEvent.save();
      res.status(201).json(newEvent);
   } catch (error) {
      res.status(500).json({ error: "Failed to save the event to MongoDB" });
   }
});

// Get All Events
app.get("/createEvent", async (req, res) => {
   try {
      const events = await Event.find();
      res.status(200).json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events from MongoDB" });
   }
});

// Get Single Event
app.get("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      if (!event) {
         return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

// Like Event
app.post("/event/:eventId", async (req, res) => {
   const eventId = req.params.eventId;

   try {
      const event = await Event.findById(eventId);
      if (!event) {
         return res.status(404).json({ message: "Event not found" });
      }

      event.likes += 1;
      const updatedEvent = await event.save();
      res.json(updatedEvent);
   } catch (error) {
      console.error("Error liking the event:", error);
      res.status(500).json({ message: "Server error" });
   }
});

// Get All Events
app.get("/events", async (req, res) => {
   try {
      const events = await Event.find();
      res.json(events);
   } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Server error" });
   }
});

// Get Event Order Summary
app.get("/event/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      if (!event) {
         return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

// Get Event Payment Summary
app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      if (!event) {
         return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

// Create Ticket
app.post("/tickets", async (req, res) => {
   try {
      const ticketDetails = req.body;
      const newTicket = new Ticket(ticketDetails);
      await newTicket.save();
      return res.status(201).json({ ticket: newTicket });
   } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ error: "Failed to create ticket" });
   }
});

// Get All Tickets
app.get("/tickets/:id", async (req, res) => {
   try {
      const tickets = await Ticket.find();
      res.json(tickets);
   } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
   }
});

// Get User Tickets
app.get("/tickets/user/:userId", async (req, res) => {
   const userId = req.params.userId;

   try {
      const tickets = await Ticket.find({ userid: userId });
      res.json(tickets);
   } catch (error) {
      console.error("Error fetching user tickets:", error);
      res.status(500).json({ error: "Failed to fetch user tickets" });
   }
});

// Delete Ticket
app.delete("/tickets/:id", async (req, res) => {
   try {
      const ticketId = req.params.id;
      const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
      if (!deletedTicket) {
         return res.status(404).json({ error: "Ticket not found" });
      }
      res.status(204).send();
   } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ error: "Failed to delete ticket" });
   }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});