import { pool } from '../lib/db';
import moment from 'moment-timezone';

export const clickevaluation = async (request) => {
    let client = await pool.connect();
    try {

        const { topic } = request;


        const date = moment().tz("Asia/Bangkok").format("YYYY-MM-DDTHH:mm:ssZ");
        const click = '1';

        if (!topic) {
            return { message: "Please provide a valid data" };
        }


        const text = 'INSERT INTO clicksevaluationform (Topic, Click, Datestimestamp) VALUES ($1, $2, $3) RETURNING *';
        const values = [topic, click, date];

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