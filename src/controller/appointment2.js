import { pool } from '../lib/db';
import uniqueString from 'unique-string';
import moment from 'moment-timezone';


export const cancelappointmentroom2 = async (request) => {
    let client = await pool.connect();
    try {

        const { event_id } = request;

        if (!event_id) {
            return { message: "Please provide a valid cmuaccount" };
        }

        const text = 'DELETE FROM user_conseling_room1 WHERE event_id = $1';
        const values = [event_id];

        const text_infor = 'DELETE FROM informationusers_room1 WHERE event_id = $1';
        const values_infor = [event_id];

        await client.query(text_infor, values_infor);
        await client.query(text, values);


    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};


export const getidcalendar2 = async (request) => {
    let client = await pool.connect();
    try {

        const { start_datetime, end_datetime, room } = request;

        if (!start_datetime && !end_datetime && !room) {
            return { message: "Please provide a valid cmuaccount" };
        }

        // Query เพื่อนำข้อมูลมาก่อน
        const query = `
         SELECT acr.event_id 
         FROM admin_conseling_room1 acr 
         WHERE start_datetime = $1 AND end_datetime = $2 AND room = $3
         `;

        const values = [start_datetime, end_datetime, room];

        const result = await client.query(query, values)

        const event_id = result.rows[0].event_id

        const query_del = `
        DELETE FROM admin_conseling_room1 WHERE event_id = $1 
      `;

        const values_del = [event_id];
        console.log(values_del);

        await client.query(query_del, values_del)

        return result.rows;

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};

export const checkappointment2 = async (request) => {
    let client = await pool.connect();
    try {
        const { studentid } = request;

        const query = `
SELECT u.firstname_lastname, u.studentid, ucr2.start_datetime, ucr2.end_datetime, ucr2.room, ucr2.event_id
FROM users u
INNER JOIN user_conseling_room1 ucr2 ON u.personid = ucr2.personid
WHERE u.studentid = $1
limit 1 ;
        `;

        const result = await client.query(query, [studentid]);

        return result.rows;

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};

export const addtimeappointment2 = async (request) => {
    let client = await pool.connect();
    try {

        const { start_datetime, end_datetime, personid, topic } = request;

        const room = 'conseling_room2'
        const event_id = uniqueString()

        const text = 'INSERT INTO user_conseling_room1 (start_datetime, end_datetime, room, personid, topic,event_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [start_datetime, end_datetime, room, personid, topic, event_id];

        const text_infor = 'INSERT INTO informationusers_room1 (personid,event_id) VALUES($1, $2) RETURNING *';
        const values_infor = [personid, event_id]

        if (!start_datetime && end_datetime && !personid && !topic) {
            return { message: "Please provide a valid data" };
        }


        await client.query(text, values);
        await client.query(text_infor, values_infor)


    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};