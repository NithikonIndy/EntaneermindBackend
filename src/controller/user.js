import { pool } from '../lib/db';
import moment from 'moment-timezone';


export const checkdata = async (request) => {
    let client = await pool.connect();
    try {
        const { studentId } = request;

        if (!studentId) {
            return { message: "Please provide a valid cmuaccount" };
        }

        const text = 'SELECT * FROM users WHERE studentid = $1';
        const values = [studentId];
        const result = await client.query(text, values);
        return result.rows
    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};


export const insertinformation = async (request) => {
    let client = await pool.connect();
    try {
        const role = "users";
        const date =  moment().tz("Asia/Bangkok").format("YYYY-MM-DDTHH:mm:ssZ");
        const { personid, studentId, phone, major, gender, facebookurl,  gradelevel  } = request;

        if (!studentId) {
            return { message: "Please provide a valid cmuaccount" };
        }


        const text = `UPDATE users SET personid =$1, phone = $3, major = $4, gender = $5, facebookurl = $6 , role = $7 
    , gradelevel = $8 ,timestamp_column = $9 WHERE studentId = $2;`;
        const values = [personid, studentId, phone, major, gender, facebookurl, role, gradelevel, date];

        const result = await client.query(text, values);
        return result.rows
    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};