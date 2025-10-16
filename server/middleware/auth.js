// server/middleware/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header missing." });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed. Invalid token." });
  }
};

module.exports = authMiddleware;
