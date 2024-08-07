import { pool } from '../lib/db';

export const getinformationusers2 = async () => {
    let client = await pool.connect();
    try {
      const text = `select u.personid ,u.firstname_lastname , u.studentid ,u.phone , u.major  , u.gender , 
            ucr.topic , u.facebookurl ,ir.details_consultation ,ir.mental_health_checklist ,ucr.start_datetime, 
            ucr.end_datetime ,ucr.room ,ucr.event_id from users u join user_conseling_room2 ucr on u.personid = ucr.personid 
            join informationusers_room2 ir on ucr.event_id = ir.event_id ORDER BY ucr.start_datetime DESC;`;
  
      const result = await client.query(text); // Using parameterized query for security
  
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

  export const listinformation2 = async (request) => {
    let client = await pool.connect();
    try {
      const { date } = request;

      if (!date) {
        return { message: "Please provide a date" };
      }
  
      const text = `
      select u.personid ,u.firstname_lastname , u.studentid ,u.phone , u.major  , u.gender , ucr.topic , u.facebookurl 
       ,ir.details_consultation ,ir.mental_health_checklist ,ucr.start_datetime, ucr.end_datetime ,ucr.room ,ucr.event_id
       from users u join user_conseling_room2 ucr on u.personid = ucr.personid join informationusers_room2 ir on ucr.event_id = ir.event_id
       WHERE DATE(ucr.start_datetime) = $1 ORDER BY ucr.start_datetime;
   `;
  
      const values = [date];
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

  export const listinformationdetail2 = async (request) => {
    let client = await pool.connect();
    try {
      const { studentid } = request;

      if (!studentid) {
        return { message: "Please provide a date" };
      }
  
      const text = `
          select ir.details_consultation ,ucr.start_datetime
        from users u join user_conseling_room2 ucr on u.personid = ucr.personid join informationusers_room2 ir on ucr.event_id = ir.event_id
        WHERE u.studentid = $1 ORDER BY ucr.start_datetime desc LIMIT 1 OFFSET 1 ;
        `;
  
      const values = [studentid];
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

  export const detailinformation2 = async (request) => {
    let client = await pool.connect();
    try {
      const { id } = request;
      if (!id) {
        return { message: "Please provide a valid ID" };
      }
      const text = `SELECT u.personid, u.firstname_lastname, u.studentid, u.phone, u.major, u.major, u.gender, 
        ucr.topic, u.facebookurl, ir.details_consultation, ir.mental_health_checklist, ir.mental_risk_level, 
        ucr.start_datetime, ucr.end_datetime, ucr.room 
        FROM users u 
        JOIN user_conseling_room2 ucr ON u.personid = ucr.personid 
        JOIN informationusers_room2 ir ON ucr.event_id = ir.event_id 
        WHERE ucr.event_id = $1`;
      
      const values = [id];
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

  export const updateinformation2 = async (request) => {
    let client = await pool.connect();
    try {
      const { details_consultation, mental_health_checklist, mental_risk_level ,id} = request;

      
      if (!id) {
        return { message: "Please provide a valid ID" };
      }
      
      const text = `UPDATE informationusers_room2 
                     SET details_consultation = $1, 
                         mental_health_checklist = $2, 
                         mental_risk_level = $3 
                     WHERE event_id = $4`;
      const values = [details_consultation, mental_health_checklist, mental_risk_level, id];
      await client.query(text, values); // Using parameterized query for security
    
      return { success: true, message: 'Information updated successfully' };
    } catch (error) {
      console.error('Error executing query:', error);
      return { error: 'Failed to update information' };
    } finally {
      if (client) {
        client.release(); // Ensure the connection is released
      }
    }
  };
  
  


  

  