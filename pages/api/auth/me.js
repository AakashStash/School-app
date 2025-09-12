import cookie from "cookie";
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  let cookies = {};
  try {
    cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  } catch (err) {
    cookies = {};
  }

  const token = cookies.token;
  if (!token) return res.json({ user: null, expiresAt: null });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = user.exp * 1000;
    res.json({ user, expiresAt });
  } catch {
    res.json({ user: null, expiresAt: null });
  }
}
