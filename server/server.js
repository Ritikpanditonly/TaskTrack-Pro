const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // <-- ADD TH
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();

dotenv.config();
connectDB();

app.use(cors({
  origin: true , // your React app's URL
  credentials: true                // 🔥 allow cookies to be sent
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // <-- VERY IMPORTANT

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
