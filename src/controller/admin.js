import { pool } from '../lib/db';
import uniqueString from 'unique-string';

//admin fisrt login
export const insertaddtodatabase = async (request) => {
    let client = await pool.connect();
    try {
        const { name, cmuaccount, studentid, organization_name, accounttype } = request;

        if (!name && !cmuaccount && !studentid && !organization_name && !accounttype) {
            return { message: "Please provide a valid data" };
        }

        const personid = uniqueString()
        const role = "admin"

        const text = 'INSERT INTO admins(personid,firstname_lastname, cmuaccount, studentid, organization_name, accounttype, role) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const values = [personid, name, cmuaccount, studentid, organization_name, accounttype, role];
        await client.query(text, values); // Using parameterized query for security
    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};

//checkadmin
export const checkadmin = async (request) => {
    let client = await pool.connect();
    try {
        const { cmuaccount } = request;

        if ( !cmuaccount ) {
            return { message: "Please provide a valid cmuaccount" };
        }

        const text = 'SELECT * FROM admins WHERE cmuaccount = $1'
        const values = [cmuaccount];
        const result = await client.query(text, values); 
        return  result.rows;

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};

export const closetimeslot = async (request) => {
    let client = await pool.connect();
    try {
        const { start_datetime, end_datetime, personid } = request;

        if (!start_datetime || !end_datetime || !personid) {
            return { message: "Please provide valid start_datetime, end_datetime, and personid" };
        }

        const event_id = uniqueString();
        const room = "conseling_room1";

        const text = 'INSERT INTO admin_conseling_room1 (event_id, start_datetime, end_datetime, room, personid) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [event_id, start_datetime, end_datetime, room, personid];
        const result = await client.query(text, values);
        return result.rows[0]; 

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to insert data');
    } finally {
        if (client) {
            client.release(); // Release the connection
        }
    }
};
