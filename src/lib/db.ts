import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env

export const pool = new Pool({
  user: process.env.PGSQL_USER,
  host: process.env.PGSQL_HOST,
  database: process.env.PGSQL_DATABASE,
  password: process.env.PGSQL_PASSWORD,
  port:5432,
  ssl: {
        rejectUnauthorized: false // Set to true in production if you have a certificate
      }
});


// export const pool = new Pool({
//   user: process.env.PGSQL_USER,
//   host: process.env.PGSQL_HOST,
//   database: process.env.PGSQL_DATABASE,
//   password: process.env.PGSQL_PASSWORD,
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false // Set to true in production if you have a certificate
//   }
// });
