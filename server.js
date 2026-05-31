require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json()); // Supaya bisa baca data JSON dari frontend

// Pakai rute auth
app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));