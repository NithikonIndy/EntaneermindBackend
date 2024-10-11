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
        const { cmuAccount } = request;
      
        if ( !cmuAccount ) {
            return { message: "Please provide a valid cmuaccount" };
        }

        const text = 'SELECT * FROM admins WHERE cmuaccount = $1'
        const values = [cmuAccount];
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
        const { start_datetime, end_datetime,room } = request;

        

        if (!start_datetime || !end_datetime || !room) {
            return { message: "Please provide valid start_datetime, end_datetime, and personid" };
        }

        const event_id = uniqueString();


        const text = 'INSERT INTO admin_conseling_room1 (event_id, start_datetime, end_datetime, room) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [event_id, start_datetime, end_datetime, room];
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

export const checkclosetimeslot = async (request) => {
    let client = await pool.connect();
    try {
        const { start_datetime, end_datetime, room } = request;

        if (!start_datetime || !end_datetime || !room) {
            return { message: "Please provide valid start_datetime, end_datetime, and room" };
        }

        const text = `
            SELECT * 
            FROM user_conseling_room1 ucr
            WHERE ucr.start_datetime::timestamptz 
            BETWEEN $1 AND $2
            AND ucr.room = $3
            ORDER BY ucr.start_datetime
        `;
        const values = [start_datetime, end_datetime, room];

        const result = await client.query(text, values);
        return result.rows;  // Return all rows, as there could be more than one matching slot

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to check time slots');
    } finally {
        if (client) {
            client.release(); // Release the connection
        }
    }
};

export const getclosetimeslot = async (request) => {
    let client = await pool.connect();
    try {
        const text = `
           SELECT *
            FROM admin_conseling_room1 acr
            WHERE acr.start_datetime::timestamptz IN (
                SELECT acr.start_datetime::timestamptz
                FROM admin_conseling_room1 acr
                WHERE acr.start_datetime::timestamptz > NOW()
                EXCEPT
                SELECT ucr.start_datetime::timestamptz
                FROM user_conseling_room1 ucr
                WHERE ucr.start_datetime::timestamptz > NOW()
            );
        `;

        const result = await client.query(text);
        return result.rows;  // Return all rows, as there could be more than one matching slot

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to check time slots');
    } finally {
        if (client) {
            client.release(); // Release the connection
        }
    }
};



export const gettimeroom = async () => {
    let client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM admin_conseling_room1 acr WHERE acr.room = 'conseling_room1' AND acr.start_datetime::timestamptz > NOW()`)
        return result.rows

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to insert data');
    } finally {
        if (client) {
            client.release(); // Release the connection
        }
    }
};

export const deltimeroom = async (request) => {
    let client = await pool.connect();
    try {
        await client.query(`DELETE FROM admin_conseling_room1 WHERE CAST(end_datetime AS TIMESTAMP) < NOW()`);
    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to insert data');
    } finally {
        if (client) {
            client.release(); // Release the connection
        }
    }
};

export const gettimeroom2 = async () => {
    let client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM admin_conseling_room1 acr WHERE acr.room = 'conseling_room2' AND acr.start_datetime::timestamptz > NOW()`)
        return result.rows

    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to insert data');
    } finally {
        if (client) {
            client.release(); // Release the connection
        }
    }
};

export const deltimeroom2 = async (request) => {
    let client = await pool.connect();
    try {
        await client.query(`DELETE FROM admin_conseling_room1 WHERE CAST(end_datetime AS TIMESTAMP) < NOW()`);
    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Failed to insert data');
    } finally {
        if (client) {
            client.release(); // Release the connection
        }
    }
};

