const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {

      const authHeader = req.headers['authorization'];

    // here we extract the token from the bearer token
    // we write the authHeader before && to check either authHeader is true or false
    // split() used to spread it and 1 means the second element of array
    const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Attach full decoded token payload
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: `Access denied. Requires one of: ${roles.join(', ')}` });
  }
  next();
};

module.exports = { authMiddleware, authorize };