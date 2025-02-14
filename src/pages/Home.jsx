import React, { useState } from "react";
import { saveAs } from "file-saver"; // Import file-saver
import axios from "axios"; // Import axios for making HTTP requests

const correctPassword = "123456"; // 6 raqamli parol

const rooms = [
  { id: 1, name: "Xona 1", capacity: 2, booked: {} },
  { id: 2, name: "Xona 2", capacity: 4, booked: {} },
  { id: 3, name: "Xona 3", capacity: 6, booked: {} },
  { id: 4, name: "Xona 4", capacity: 3, booked: {} },
  { id: 5, name: "Xona 5", capacity: 5, booked: {} },
  { id: 6, name: "Xona 6", capacity: 4, booked: {} },
  { id: 7, name: "Xona 7", capacity: 7, booked: {} },
  { id: 8, name: "Xona 8", capacity: 2, booked: {} },
  { id: 9, name: "Xona 9", capacity: 3, booked: {} },
  { id: 10, name: "Xona 10", capacity: 5, booked: {} },
  { id: 11, name: "Xona 11", capacity: 4, booked: {} },
  { id: 12, name: "Xona 12", capacity: 6, booked: {} },
  { id: 13, name: "Xona 13", capacity: 2, booked: {} },
  { id: 14, name: "Xona 14", capacity: 3, booked: {} },
  { id: 15, name: "Xona 15", capacity: 4, booked: {} },
];

const Home = () => {
  const [roomData, setRoomData] = useState(rooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "", shift: "" });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedShift, setSelectedShift] = useState("kun");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Noto'g'ri parol!");
    }
  };

  const handleBookRoom = (roomId) => {
    if (!form.name || !form.phone || !form.date || !form.shift) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    setRoomData((prev) => {
      const updatedRooms = prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              booked: {
                ...room.booked,
                [form.date]: {
                  ...room.booked[form.date],
                  [form.shift]: { name: form.name, phone: form.phone },
                },
              },
            }
          : room
      );

      // Send the updated room data to the server
      axios.post("http://localhost:5000/book-room", { updatedRooms })
        .then(response => {
          console.log(response.data);
          alert("Xona muvaffaqiyatli band qilindi!");
        })
        .catch(error => {
          console.error(error);
          alert("Xatolik yuz berdi!");
        });

      return updatedRooms;
    });

    setSelectedRoom(null);
    setForm({ name: "", phone: "", date: "", shift: "" });
  };

  const handleCancelBooking = (roomId, shift) => {
    setRoomData((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              booked: {
                ...room.booked,
                [selectedDate]: {
                  ...room.booked[selectedDate],
                  [shift]: undefined,
                },
              },
            }
          : room
      )
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      {/* Agar foydalanuvchi autentifikatsiyadan o'tmagan bo'lsa, parolni kiritish uchun forma */}
      {!isAuthenticated ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
            <h2 className="text-xl font-bold mb-4 text-center">Sahifaga kirish</h2>
            <input
              type="password"
              placeholder="6 raqamli parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
              onClick={handlePasswordSubmit}
            >
              Kirish
            </button>
          </div>
        </div>
      ) : (
        // Home sahifasi kontenti (agar foydalanuvchi autentifikatsiyadan o'tgan bo'lsa)
        <>
          <h1 className="text-2xl font-bold mb-4 text-center">Xonalar Roʻyxati</h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 mb-4 text-black w-full md:w-64 mx-auto"
          />
          <div className="flex justify-center space-x-10 mb-4">
            <label className="flex items-center space-x-2 text-xl">
              <input
                type="radio"
                name="shift"
                value="kun"
                checked={selectedShift === "kun"}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="mr-2 w-5 h-5"
              />
              <span>Kunduzgi</span>
            </label>
            <label className="flex items-center space-x-2 text-xl">
              <input
                type="radio"
                name="shift"
                value="kech"
                checked={selectedShift === "kech"}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="mr-2 w-5 h-5"
              />
              <span>Kechki</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomData.map((room) => (
              <div
                key={room.id}
                className={`p-6 border rounded-lg cursor-pointer transition duration-300 transform hover:scale-105 ${
                  room.booked[selectedDate]?.[selectedShift]
                    ? "bg-red-500 text-white"
                    : "bg-green-200"
                }`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <h2 className="text-lg font-semibold">{room.name}</h2>
                <p className="text-sm">Kapasite: {room.capacity} kishiga</p>
                {room.booked[selectedDate]?.kun && selectedShift === "kun" && (
                  <div className="mt-2 text-sm">
                    <p>Kunduzgi: {room.booked[selectedDate].kun.name}</p>
                    <p>Telefon raqam: {room.booked[selectedDate].kun.phone}</p>
                    <button
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelBooking(room.id, "kun");
                      }}
                    >
                      Bandlikni bekor qilish
                    </button>
                  </div>
                )}
                {room.booked[selectedDate]?.kech && selectedShift === "kech" && (
                  <div className="mt-2 text-sm">
                    <p>Kechki: {room.booked[selectedDate].kech.name}</p>
                    <p>Telefon raqam: {room.booked[selectedDate].kech.phone}</p>
                    <button
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelBooking(room.id, "kech");
                      }}
                    >
                      Bandlikni bekor qilish
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {selectedRoom && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
                <h2 className="text-xl font-bold mb-4 text-center">Xonani Band Qilish</h2>
                <input
                  type="text"
                  placeholder="Ism Familiya"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Telefon raqam"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <select
                  value={form.shift}
                  onChange={(e) => setForm({ ...form, shift: e.target.value })}
                  className="border p-2 w-full mb-4"
                >
                  <option value="" disabled>Tanlang</option>
                  <option value="kun">Kunduzgi</option>
                  <option value="kech">Kechki</option>
                </select>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
                  onClick={() => handleBookRoom(selectedRoom)}
                >
                  Band qilish
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full mt-2"
                  onClick={() => setSelectedRoom(null)}
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
