import bcrypt from "bcrypt";
import { createAdmin } from "../../models/userModel.js";

import { SECRET_KEY } from "../../config/secret.js";

// === REGISTER ADMIN ===
export async function registerAdmin(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Isi username dan password!" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await createAdmin(username, hashedPassword);
  res.json({ message: "Admin berhasil dibuat!" });
}
