require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const User = require("./models/User");
const Task = require("./models/Task");
const path = require("path");

const app = express();

// Allow CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);

// Serve static images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Sync Database
sequelize
  .sync({ force: false }) // Set to true if you want to reset DB
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Error syncing database: ", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
