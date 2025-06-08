import express from 'express';
import dotenv from 'dotenv';
import { sql, initDB } from './config/db.js';
import ratelimiter from './middelware/rateLimiter.js';

//Import routes
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

// Initialize the Express application
const app = express();

// Middlewares
app.use(express.json());
app.use(ratelimiter);

const PORT = process.env.PORT || 5001;



app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker API!"); 
});


app.use("/api/transactions", transactionsRoute);



initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});