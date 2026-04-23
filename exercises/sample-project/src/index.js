const express = require("express");
const config = require("./config");
const { listVehicles, getVehicle, createVehicle, deleteVehicle, getStats } = require("./api");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/api/vehicles", listVehicles);
app.get("/api/vehicles/:id", getVehicle);
app.post("/api/vehicles", createVehicle);
app.delete("/api/vehicles/:id", deleteVehicle);
app.get("/api/stats", getStats);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Start server
app.listen(config.port, () => {
  console.log(`Workshop Sample API running on port ${config.port}`);
});

module.exports = app;
