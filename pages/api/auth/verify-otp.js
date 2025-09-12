import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { getConnection } from "@/lib/db";

const { JWT_SECRET, JWT_EXPIRES_IN = "1h" } = process.env;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Missing fields" });

  try {
    const conn = await getConnection();

    const [rows] = await conn.execute(
      "SELECT id, otp_hash, expires_at, used FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1",
      [email]
    );

    if (!rows.length) {
      await conn.end();
      return res.status(400).json({ error: "OTP not found" });
    }

    const record = rows[0];

    if (record.used) {
      await conn.end();
      return res.status(400).json({ error: "OTP already used" });
    }

    if (new Date(record.expires_at) < new Date()) {
      await conn.end();
      return res.status(400).json({ error: "OTP expired" });
    }

    const valid = await bcrypt.compare(otp, record.otp_hash);
    if (!valid) {
      await conn.end();
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await conn.execute("UPDATE otps SET used = 1 WHERE id = ?", [record.id]);
    await conn.end();

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10, 
      })
    );

    const decoded = jwt.decode(token);
    const expiresAt = decoded.exp * 1000;

    res.json({ ok: true, expiresAt });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
}
