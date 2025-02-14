import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const filePath = './rooms.json';

// API endpoint for booking rooms
app.post('/book-room', (req, res) => {
  const { updatedRooms } = req.body;

  // Save the updated rooms data to a file
  fs.writeFile(filePath, JSON.stringify(updatedRooms, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Xatolik yuz berdi.');
    }
    res.status(200).send('Xona muvaffaqiyatli band qilindi.');
  });
});

// API endpoint to fetch room data
app.get('/rooms', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Xatolik yuz berdi.');
    }
    res.status(200).json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Server ishlamoqda, port ${port}da`);
});
