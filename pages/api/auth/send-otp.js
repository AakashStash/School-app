import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { getConnection } from "@/lib/db"; 

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  OTP_EXPIRY_MINUTES = 10,
} = process.env;

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT || 587),
  secure: false,
  auth: { user: MAIL_USER, pass: MAIL_PASS },
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  try {
    const conn = await getConnection();
    await conn.execute(
      "INSERT INTO otps (email, otp_hash, expires_at) VALUES (?, ?, ?)",
      [email, otpHash, expiresAt]
    );
    await conn.end();

    await transporter.sendMail({
      from: MAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    });

    res.json({ ok: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}
