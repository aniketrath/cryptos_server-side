require('dotenv').config();
const express = require('express');
const client = require('prom-client'); // Import prom-client for Prometheus
// Import the database connection function
const connectDB = require('./config/database');
// Import Routes :
const updateDatabase = require('./app/routes/updateRoutes');
const databaseRoutes = require('./app/routes/databaseRoutes');
const authRoutes = require('./app/routes/authRoutes')
const authenticateJWT = require('./middlewares/authMiddleware');

// Initialize Express app @6000 by env
const app = express();
const port = process.env.PORT || 3000;

// Create a Registry and define Metrics
const register = new client.Registry();
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestsTotal);

// Middleware to parse JSON bodies
app.use(express.json());
connectDB();

// Log and count requests for Prometheus
app.use((req, res, next) => {
  res.on('finish', () => {
    // Increment the counter for each request, using method, route, and status
    httpRequestsTotal.inc({ method: req.method, route: req.route?.path || 'unknown', status: res.statusCode });
  });
  next();
});

// Calling Imported Routes with Prefixes :
// Use the authentication routes
app.use('/auth', authRoutes);
app.use('/update', authenticateJWT, updateDatabase);
app.use('/app', databaseRoutes);

app.get('/', (req, res) => {
  // Get the IP address of the user
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  // Log the access with IP
  console.log(`[${new Date().toISOString()}] Server is accessed from IP: ${userIP}`);
  res.send(`[${new Date().toISOString()}] Server is accessed from IP: ${userIP}`);
});


// Expose the /metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
