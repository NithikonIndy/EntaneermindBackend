import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as Minio from 'minio'

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

export const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9011,
  useSSL: false,
  accessKey: 'Entaneer_mind',
  secretKey: 'ILoveYou300AndMind',
})


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
