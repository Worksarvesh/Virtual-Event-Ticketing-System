const express = require('express');
const UserModel = require('../models/User');
const router = express.Router();

// Route to update user profile
router.put('/update', async (req, res) => {
    const { userId, name, email } = req.body;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { name, email }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

module.exports = router;
