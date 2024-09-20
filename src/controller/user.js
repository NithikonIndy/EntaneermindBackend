import { pool } from '../lib/db';
import moment from 'moment-timezone';
import uniqueString from 'unique-string';

export const afterlogin = async (request) => {
    let client = await pool.connect();
    try {
        const personid = uniqueString()
        const {  name, cmuaccount, studentid, organization_name, accounttype } = request;

        if (!studentid && !personid && !name && !organization_name && !accounttype) {
            return { message: "Please provide a valid cmuaccount" };
        }

        const text = 'INSERT INTO users(personid,firstname_lastname, cmuaccount, studentid, organization_name, accounttype) VALUES($1, $2, $3, $4, $5,$6) RETURNING *';
        const values = [personid, name, cmuaccount, studentid, organization_name, accounttype];
        const result = await client.query('SELECT studentid FROM users WHERE studentid = $1', [studentid]);

        if (result.rowCount === 0) {
             await client.query(text, values);
        }

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};


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
        const date = moment().tz("Asia/Bangkok").format("YYYY-MM-DDTHH:mm:ssZ");
        const { personid, studentId, phone, major, gender, facebookurl, gradelevel } = request;

        if (!studentId && !personid && !phone && !major && !gender && !facebookurl && !gradelevel) {
            return { message: "Please provide a valid data" };
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

export const getmailandtime = async (request) => {
    let client = await pool.connect();
    try {
        const result = await client.query(`SELECT *
FROM user_conseling_room1 ucr
JOIN users u ON u.personid = ucr.personid
WHERE (ucr.start_datetime::timestamptz) 
      BETWEEN NOW() AND (NOW() + INTERVAL '1440 minute')`)
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