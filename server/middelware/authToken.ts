import jwt from "jsonwebtoken";
import config from "../config/config";

const authTokenMiddleware = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  await jwt.verify(token, config.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
  });
  next();
};

export default authTokenMiddleware;
