import { pool } from '../lib/db';

export const cancelappointmentroom2 = async (request) => {
    let client = await pool.connect();
    try {

        const { event_id } = request;

        if (!event_id) {
            return { message: "Please provide a valid cmuaccount" };
        }

        const text = 'DELETE FROM user_conseling_room2 WHERE event_id = $1';
        const values = [event_id];

        const text_infor = 'DELETE FROM informationusers_room2 WHERE event_id = $1';
        const values_infor = [event_id];

        await client.query(text, values);
        await client.query(text_infor, values_infor);



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

        const { start_datetime, end_datetime } = request;

        if (!start_datetime && end_datetime) {
            return { message: "Please provide a valid cmuaccount" };
        }

        const query = `
        SELECT acr.event_id 
        FROM admin_conseling_room2 acr 
        WHERE start_datetime = $1 AND  end_datetime = $2
      `;
        const values = [start_datetime, end_datetime];

        return await client.query(query, values);
        // await client.query(text_infor, values_infor);



    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};
