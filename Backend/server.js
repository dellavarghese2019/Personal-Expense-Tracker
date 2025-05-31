require('dotenv').config();
const express = require('express');
const { connectToDB } = require('./config/db'); // path may vary
const cors = require('cors');
const mongoose = require('mongoose');



const app = express();

app.use(cors({
  origin: 'http://localhost:4200',  // allow Angular frontend
  credentials: true                 // if you're sending cookies (optional for JWT)
}));

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/your-db')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


const authRoutes = require('./routes/authRoutes')

app.use('/api/auth', authRoutes);

const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

const profile = require('./routes/profile');
app.use('/api/users', profile)

// 👇 Connect to MongoDB before starting the server

  app.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
  });
