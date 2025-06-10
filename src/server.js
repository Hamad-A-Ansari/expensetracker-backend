import express from 'express';
import dotenv from 'dotenv';
import { sql, initDB } from './config/db.js';
import ratelimiter from './middelware/rateLimiter.js';
import job from './config/cron.js';

//Import routes
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

// Initialize the Express application
const app = express();

if(process.env.NODE_ENV === "production") job.start(); // Start the cron job if in production environment

// Middlewares
app.use(express.json());
app.use(ratelimiter);

const PORT = process.env.PORT || 5001;



app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running smoothly!" }); 
});


app.use("/api/transactions", transactionsRoute);



initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});