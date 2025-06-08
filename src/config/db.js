import {neon} from '@neondatabase/serverless';
import "dotenv/config";

//Create a Neon SQL client instance
export const sql =  neon(process.env.DATABASE_URL);

export async function initDB() {
  // Test the database connection
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log('Database Initialized successfully');
  } catch (error) {
    console.error('Error Initializing Database:', error);
    process.exit(1);
  }
}