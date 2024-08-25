const express = require('express');
const app = express();
const env = require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');  // Add this line
const authRoutes = require('./routes/auth');
const {authenticate} = require('./middleware/authMiddleware');
const userRoutes = require('./routes/user');
const testRoutes = require('./routes/test');
const systemCheckRoutes = require('./routes/systemCheck');
const cors = require('cors');

require('./cron/evaluateTests'); // Import cron jobs


const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());  // Add this line
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Connection error', error.message);
});

// Routes
app.get('/', authenticate, (req, res) => {
    res.send('Welcome to the MERN Authentication API');
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/system-check', systemCheckRoutes);
app.use("*", (req, res) => res.status(404).json({ error: "Page Not found" }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
