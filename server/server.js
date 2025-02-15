import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

const ROOMS_FILE = path.join(__dirname, "rooms.json");

// Middleware
app.use(express.json());
app.use(cors());

// Xonalar ma'lumotlarini yuklash
const loadRooms = () => {
  if (!fs.existsSync(ROOMS_FILE)) {
    fs.writeFileSync(ROOMS_FILE, JSON.stringify([], null, 2));
  }
  return JSON.parse(fs.readFileSync(ROOMS_FILE, "utf-8"));
};

// Xonalar ro‘yxatini olish
app.get("/rooms", (req, res) => {
  const rooms = loadRooms();
  res.json(rooms);
});

// Xonani band qilish
app.post("/book-room", (req, res) => {
  const { updatedRooms } = req.body;
  fs.writeFile(ROOMS_FILE, JSON.stringify(updatedRooms, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: "Xatolik yuz berdi" });
    }
    res.json({ message: "Xona muvaffaqiyatli band qilindi!" });
  });
});

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
