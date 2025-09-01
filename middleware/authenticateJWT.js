import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Attach decoded payload to request object based on token type
      if (decoded.userId) {
        req.user = { userId: decoded.userId };
      } else if (decoded.adminId) {
        req.admin = { adminId: decoded.adminId };
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authenticateJWT;