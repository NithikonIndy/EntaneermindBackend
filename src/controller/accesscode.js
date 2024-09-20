import { pool } from '../lib/db';

export const insertaccesscode = async (request) => {
    let client = await pool.connect();
    try {
        const { accesscode } = request;

        if (!accesscode) {
            return { message: "Please provide a valid data" };
        }

        const text = 'INSERT INTO accesscode (accesscode) VALUES($1) RETURNING *';
        const values = [accesscode];
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

export const checkaccesscode = async (request) => {
    let client = await pool.connect();
    try {
        const { accesscode } = request;

        if (!accesscode) {
            return { message: "Please provide a date" };
        }

        const text = 'SELECT * FROM accesscode WHERE accesscode = $1';
        const values = [accesscode];
        const result = await client.query(text, values); // Using parameterized query for security

        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        return { error: 'Failed to fetch data' };
    } finally {
        if (client) {
            client.release(); // Ensure the connection is released
        }
    }
};

export const deletemulaccesscode = async (request) => {
    let client = await pool.connect();
    try {
        const { accesscode } = request;

        if (!accesscode) {
            return { message: "Please provide a date" };
        }

        const text = 'DELETE FROM accesscode WHERE accesscode = $1';
        const values = [accesscode];
        await client.query(text, values); // Using parameterized query for security

    } catch (error) {
        console.error('Error executing query:', error);
        return { error: 'Failed to fetch data' };
    } finally {
        if (client) {
            client.release(); // Ensure the connection is released
        }
    }
};

export const deleteautoaccesscode = async () => {
    let client = await pool.connect();
    try {

        const text = `DELETE FROM accesscode WHERE expire_datetime < NOW() - INTERVAL '1440 minute';`;
        await client.query(text); // Using parameterized query for security

    } catch (error) {
        console.error('Error executing query:', error);
        return { error: 'Failed to fetch data' };
    } finally {
        if (client) {
            client.release(); // Ensure the connection is released
        }
    }
};

export const findpersonid = async (request) => {
    let client = await pool.connect();
    try {

        const { personId } = request;

        if (!personId) {
            return { message: "Please provide a date" };
        }

        const text = `SELECT u.personid FROM users u WHERE u.personid = $1`;
        const values = [personId]; // Parameterized query values
        const result = await client.query(text, values); 
        return result.rows

    } catch (error) {
        console.error('Error executing query:', error);
        return { error: 'Failed to fetch data' };
    } finally {
        if (client) {
            client.release(); // Ensure the connection is released
        }
    }
};