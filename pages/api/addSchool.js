// import formidable from "formidable";
// import fs from "fs";
// import path from "path";
// import { getConnection } from "../../lib/db";

// export const config = {
//   api: {
//     bodyParser: false, 
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const form = formidable({
//       multiples: false,
//       uploadDir: path.join(process.cwd(), "public/schoolImages"),
//       keepExtensions: true, 
//     });

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return res.status(500).json({ message: "File upload error" });
//       }

//       try {
//         const { name, address, city, state, contact, email_id } = fields;

//         const imageFile = files.image[0]; 
//         const image = `/schoolImages/${path.basename(imageFile.filepath)}`;

//         const connection = await getConnection();
//         await connection.execute(
//           "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
//           [name[0], address[0], city[0], state[0], contact[0],image, email_id[0] ]
//         );
//         connection.end();

//         res.status(200).json({ message: "School added successfully!" });
//       } catch (error) {
//       if (error.code === "ER_DUP_ENTRY") {
//         if (error.sqlMessage.includes("name")) {
//           res.status(400).json({ message: "❌ School with this name already exists" });
//         } else if (error.sqlMessage.includes("email_id")) {
//           res.status(400).json({ message: "❌ School with this email already exists" });
//         } else if (error.sqlMessage.includes("contact")) {
//           res.status(400).json({ message: "❌ School with this contact number already exists" });
//         } else {
//           res.status(400).json({ message: "❌ Duplicate entry found" });
//         }      } else {
//         console.error(error);
//         res.status(500).json({ message: "Error while saving school" });
//       }
//     }
//     });
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }

import formidable from "formidable";
import cloudinary from "../../lib/cloudinary"; // your Cloudinary config
import { getConnection } from "../../lib/db";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ message: "File upload error" });

      try {
        const { name, address, city, state, contact, email_id } = fields;
        const imageFile = files.image[0];
         console.log(files.image)
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(imageFile.filepath, {
          folder: "schools",
        });
        const image = result.secure_url;

        const connection = await getConnection();
        await connection.execute(
          "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [name[0], address[0], city[0], state[0], contact[0], image, email_id[0]]
        );
        connection.end();

        res.status(200).json({ message: "School added successfully!" });
      } catch (error) {
        // Keep your detailed duplicate entry error messages
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
          console.error(error);
          res.status(500).json({ message: "Error while saving school" });
        }
      }
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

