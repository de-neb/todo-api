const express = require("express");
require("dotenv").config();

// routes
const taskRoutes = require("./routes/task");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/tasks", taskRoutes);
app.use((req, res, next) => {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

module.exports = app;
