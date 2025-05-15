require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const jobRoutes = require('./routes/job-routes');
const adminRoutes = require('./routes/admin-routes');
const applicationRoutes = require('./routes/application-routes');

const app = express();
const PORT = process.env.PORT || 3000;

// database connection
connectToDB();

// middleware
app.use(express.json());

// connect all the routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs/application', applicationRoutes);

app.listen(PORT, () => {
    console.log(`Server start listening at ${PORT}`);
});