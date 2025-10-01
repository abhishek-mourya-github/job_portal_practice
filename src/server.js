require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const jobRoutes = require('./routes/job-routes');
const adminRoutes = require('./routes/admin-routes');
const applicationRoutes = require('./routes/application-routes');
const errorHandler = require('./middleware/error-handler');

const app = express();
const PORT = process.env.PORT || 3000;

// database connection
connectToDB();

// middleware
app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));

// basic rate limiting on auth to mitigate brute-force
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.get('/', () => {
    console.log("welcome to our job portal");
})

// connect all the routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs/application', applicationRoutes);

// global error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server start listening at ${PORT}`);
});