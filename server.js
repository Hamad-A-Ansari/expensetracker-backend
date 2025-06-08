import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Express application
const app = express();


const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker API!"); 
});

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
});