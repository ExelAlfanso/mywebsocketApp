import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function authenticateToken(req, res, next) {
  const cookies = req.headers.cookie;
  if (!cookies)
    return res.status(401).json({ message: "No cookies provided." });

  const parsedCookies = cookie.parse(cookies);
  const token = parsedCookies.accessToken;

  if (!token) return res.status(401).json({ message: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}
