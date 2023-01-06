import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

/* const connection = new Pool({
  user: 'postgres',
  password: '310799',
  host: 'localhost',
  port: 5432,
  database: 'funtasy-rent'
}); */
console.log(process.env.DATABASE_URL)
const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default connection;