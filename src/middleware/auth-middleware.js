const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {

    // here we are accessing the Authorization section where usually we get the token,
    // in postman we get the Authorization named different section to put the token
    const authHeader = req.headers['authorization'];

    // now we are checking either we get the token or not in the Authorization section
    // if yes then extract the token out of it
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Authorization token required" 
        });
    }

    // here we first verify the token using token which is already obtained from the Authorization section
    // and using JWT_SECRET_KEY decode the token to get the user details
    // user detail is very important to check either user role is recruiter or admin or not to perform some
    // operations like job posting, updating, deletion.
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = {
            _id: decoded._id,
            username: decoded.username,
            role: decoded.role
        };

        next();

    } catch (err) {
        console.error("Token Verification Error:", err);
        res.status(401).json({ 
            success: false, 
            message: err.name === 'TokenExpiredError'? "Token expired" : "Invalid token" 
        });
    }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};

module.exports = {authMiddleware, authorize};