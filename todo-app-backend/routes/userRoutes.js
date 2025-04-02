const express = require("express");
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, req.user.id + path.extname(file.originalname)); // Store file with user ID
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  verifyToken,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.profilePic = `/uploads/${req.file.filename}`; // Save relative path
      await user.save();

      res.json({
        message: "Profile picture uploaded successfully!",
        profilePic: user.profilePic,
      });
    } catch (error) {
      res.status(500).json({ error: "Error saving profile picture" });
    }
  }
);

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const serverUrl = `${req.protocol}://${req.get("host")}`; // e.g., http://localhost:5000
    const profilePicUrl = user.profilePic
      ? `${serverUrl}${user.profilePic}`
      : null;

    res.json({
      name: user.name, // Fix: Return correct 'name' field
      email: user.email,
      profilePic: profilePicUrl, // Fix: Return correct 'profilePic' URL
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

router.put("/update-name", verifyToken, async (req, res) => {
  // console.log("Received request to update name");
  // console.log("User ID:", req.user?.id);
  // console.log("Request Body:", req.body);
  try {
    const { name } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name;
    await user.save();

    res.json({ message: "Name updated successfully!", name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating name" });
  }
});

module.exports = router;
