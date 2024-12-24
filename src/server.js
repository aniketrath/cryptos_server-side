require("dotenv").config();
const express = require("express");
const client = require("prom-client"); // Import prom-client for Prometheus
// Import the database connection function
const connectDB = require("./config/database");
const log = require("./app/utils/logger");
const cors = require("cors");
const os = require("os");
// Import Routes :
const updateDatabase = require("./app/routes/updateRoutes");
const databaseRoutes = require("./app/routes/databaseRoutes");
const authRoutes = require("./app/routes/authRoutes");
const authenticateJWT = require("./middlewares/authMiddleware");

// Initialize Express app @6000 by env
const app = express();
// Enable CORS for all origins
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  }),
);

const port = process.env.PORT || 3000;

// Create a Registry and define Metrics
const register = new client.Registry();
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});
const responseTimeHistogram = new client.Histogram({
  name: "http_response_time_seconds",
  help: "HTTP response time in seconds",
  labelNames: ["method", "route", "status"],
});
// System-level metrics
const systemMetrics = {
  cpuUsageGauge: new client.Gauge({
    name: "system_cpu_usage_percentage",
    help: "CPU usage as a percentage",
  }),
  memoryUsageGauge: new client.Gauge({
    name: "system_memory_usage_percentage",
    help: "Memory usage as a percentage",
  }),
  diskUsageGauge: new client.Gauge({
    name: "system_disk_usage_percentage",
    help: "Disk usage as a percentage",
  }),
};

// Function to collect system metrics
const collectSystemMetrics = () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercentage = (usedMemory / totalMemory) * 100;

  // Simulate CPU usage
  const cpuUsagePercentage = (os.loadavg()[0] * 100) / os.cpus().length;

  // Placeholder for disk usage
  const diskUsagePercentage = Math.random() * 100; // Simulated

  // Update gauges
  systemMetrics.cpuUsageGauge.set(cpuUsagePercentage);
  systemMetrics.memoryUsageGauge.set(memoryUsagePercentage);
  systemMetrics.diskUsageGauge.set(diskUsagePercentage);
};

// Collect system metrics every 5 seconds
setInterval(collectSystemMetrics, 5000);

// Register metrics
register.registerMetric(httpRequestsTotal);
register.registerMetric(responseTimeHistogram);
// Register the system metrics
register.registerMetric(systemMetrics.cpuUsageGauge);
register.registerMetric(systemMetrics.memoryUsageGauge);
register.registerMetric(systemMetrics.diskUsageGauge);

// Middleware to parse JSON bodies
app.use(express.json());
connectDB();

// Log and count requests for Prometheus

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const durationInSeconds =
      process.hrtime(start)[0] + process.hrtime(start)[1] / 1e9;

    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || "unknown",
      status: res.statusCode,
    });

    responseTimeHistogram.observe(
      {
        method: req.method,
        route: req.route?.path || "unknown",
        status: res.statusCode,
      },
      durationInSeconds,
    );
  });

  next();
});

// Calling Imported Routes with Prefixes :
// Use the authentication routes
app.use("/auth", authRoutes);
app.use("/update", authenticateJWT, updateDatabase);
app.use("/app", databaseRoutes);

app.get("/", (req, res) => {
  // Get the IP address of the user
  const userIP =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
  // Log the access with IP
  log("[INFO]", `Server is being accessed from IP: ${userIP}`);
  res.send(
    `[${new Date().toISOString()}] Server is being accessed from IP: ${userIP}`,
  );
});

// Expose the /metrics endpoint for Prometheus to scrape
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
