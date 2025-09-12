import { parse } from "cookie"; // ✅ Correct import
import formidable from "formidable";
import cloudinary from "../../lib/cloudinary";
import { getConnection } from "../../lib/db";
import jwt from "jsonwebtoken";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // 🔹 Step 1: Auth check
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token;

    console.log("👉 Cookies from request:", req.headers.cookie);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Please login first" });
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // 🔹 Step 2: File upload + DB insert
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ message: "File upload error" });

      let connection;
      try {
        const { name, address, city, state, contact, email_id } = fields;

        // ✅ Fix: handle formidable v3 file object
        const imageFile = files.image?.[0] || files.image;

        if (!imageFile || !imageFile.filepath) {
          return res.status(400).json({ message: "❌ Image is required" });
        }

        // 🔹 Upload to Cloudinary
        const result = await cloudinary.uploader.upload(imageFile.filepath, {
          folder: "schools",
        });
        const image = result.secure_url;

        // 🔹 Insert into DB
        connection = await getConnection();
        await connection.execute(
          "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            name?.[0] || name,
            address?.[0] || address,
            city?.[0] || city,
            state?.[0] || state,
            contact?.[0] || contact,
            image,
            email_id?.[0] || email_id,
          ]
        );

        res.status(200).json({ message: "✅ School added successfully!" });
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          if (error.sqlMessage.includes("name")) {
            res.status(400).json({ message: "❌ School with this name already exists" });
          } else if (error.sqlMessage.includes("email_id")) {
            res.status(400).json({ message: "❌ School with this email already exists" });
          } else if (error.sqlMessage.includes("contact")) {
            res.status(400).json({ message: "❌ School with this contact number already exists" });
          } else {
            res.status(400).json({ message: "❌ Duplicate entry found" });
          }
        } else {
          console.error("DB/Upload Error:", error);
          res.status(500).json({ message: "😫Error while saving school" });
        }
      } finally {
        if (connection) connection.end();
      }
    });
  } catch (err) {
    console.error("😭Auth check error:", err);
    res.status(500).json({ message: "😭Authentication error" });
  }
}
