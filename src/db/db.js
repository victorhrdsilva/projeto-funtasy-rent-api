import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
  user: 'postgres',
  password: '310799',
  host: 'localhost',
  port: 5432,
  database: 'funtasy-rent'
});

/* const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
}); */

export default connection;