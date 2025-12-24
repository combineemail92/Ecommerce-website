const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = bearerHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user; // attach user to request
    next();
  } catch (e) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = auth;
