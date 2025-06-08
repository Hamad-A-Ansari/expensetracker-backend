import {neon} from '@neondatabase/serverless';
import "dotenv/config";

//Create a Neon SQL client instance
export const sql =  neon(process.env.DATABASE_URL);