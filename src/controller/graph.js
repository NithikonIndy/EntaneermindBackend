
import { pool } from '../lib/db';


export const graphmentalhealthchecklist = async (request) => {
  let client;
  try {
    const { startdate, enddate } = request;

    // console.log(request);
    if (!startdate && !enddate) {
      return { message: "Please provide a date" };
    }

    const text = `SELECT 
  CASE 
    WHEN ir.mental_health_checklist LIKE '%คะแนนแบบวัดพลังใจสูง%' THEN 'คะแนนแบบวัดพลังใจสูง'
    WHEN ir.mental_health_checklist LIKE '%มีอารมณ์เศร้าอย่างต่อเนื่องหรือเป็นโรคซึมเศร้า(วินิจฉัยโดยแพทย์)%' THEN 'มีอารมณ์เศร้าอย่างต่อเนื่องหรือเป็นโรคซึมเศร้า(วินิจฉัยโดยแพทย์)'
    WHEN ir.mental_health_checklist LIKE '%ความเศร้าโศกจากการสูญเสีย%' THEN 'ความเศร้าโศกจากการสูญเสีย'
    WHEN ir.mental_health_checklist LIKE '%บาดแผลทางใจ%' THEN 'บาดแผลทางใจ/ประสบการณ์เลวร้ายในวัยเด็ก'
    WHEN ir.mental_health_checklist LIKE '%คิดเกี่ยวกับความตาย%' OR ir.mental_health_checklist LIKE '%คิดทำร้ายตัวเอง%' THEN 'ความคิดฆ่าตัวตาย/ความคิดทำร้ายตัวเอง'
    WHEN ir.mental_health_checklist LIKE '%ปัญหาการปรับตัว%' THEN 'ปัญหาการปรับตัว/ขาดทักษะทางสังคม'
    WHEN ir.mental_health_checklist LIKE '%ปัญหาความสัมพันธ์ภายในครอบครัว%' THEN 'ปัญหาความสัมพันธ์ภายในครอบครัว'
    WHEN ir.mental_health_checklist LIKE '%ปัญหาความสัมพันธ์กับคนรัก%' THEN 'ปัญหาความสัมพันธ์กับคนรัก'
    WHEN ir.mental_health_checklist LIKE '%ปัญหาความสัมพันธ์เพื่อน%' THEN 'ปัญหาความสัมพันธ์เพื่อน'
    WHEN ir.mental_health_checklist LIKE '%พฤติกรรมเสพติด%' THEN 'พฤติกรรมเสพติด'
    WHEN ir.mental_health_checklist LIKE '%กลุ่มวิตกกังวล%' THEN 'ปัญหาสุขภาพจิตในกลุ่มวิตกกังวล'
    WHEN ir.mental_health_checklist LIKE '%เจ็บป่วยทางกาย%' THEN 'มีอาการเจ็บป่วยทางกายจากปัญหาทางจิตใจ'
    WHEN ir.mental_health_checklist LIKE '%ปัญหาการเรียน%' THEN 'ปัญหาการเรียน/หมดไฟในการเรียน'
    WHEN ir.mental_health_checklist LIKE '%เข้าใจหรือพัฒนาตนเอง%' THEN 'ต้องการเข้าใจหรือพัฒนาตนเอง/ค้นหาเป้าหมายชีวิต'
    WHEN ir.mental_health_checklist LIKE '%ปัญหาบุคลิกภาพ%' THEN 'ปัญหาบุคลิกภาพ'
    ELSE 'อื่น ๆ'
  END AS checklist_category,
  COUNT(*) AS checklist_count
FROM users u
JOIN user_conseling_room1 ucr ON u.personid = ucr.personid
JOIN informationusers_room1 ir ON ucr.event_id = ir.event_id
                    WHERE ucr.start_datetime BETWEEN $1 AND $2
                    GROUP BY ir.mental_health_checklist;`;

    const values = [startdate, enddate];
    client = await pool.connect();
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

// input must have date and this is data of  appointment not for single-people each major
export const graphappointmentforgradelevel = async (request) => {
  let client = await pool.connect();
  try {
    const { startdate, enddate } = request;

    if (!startdate && !enddate) {
      return { message: "Please provide a valid data" };
    }

    const text = `SELECT u.gradelevel, COUNT(*) AS gradelevel_count
                FROM users u
                JOIN user_conseling_room1 ucr ON u.personid = ucr.personid
                JOIN informationusers_room1 ir ON ucr.event_id = ir.event_id
                WHERE ucr.start_datetime BETWEEN $1 AND $2
                GROUP BY u.gradelevel;
    `;
    const values = [startdate, enddate];
    const result = await client.query(text, values); // Using parameterized query for security

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

export const graphappointmentforbachelordegree = async (request) => {
  let client = await pool.connect();
  try {
    const { startdate, enddate } = request;

    if (!startdate && !enddate) {
      return { message: "Please provide a valid data" };
    }

    const text = `SELECT 
    CASE
        WHEN (date_part('year', now()) - (CAST('25' || SUBSTR(u.studentid, 1, 2) AS INTEGER)) + 544) > 4
        THEN 'มากกว่าปี 4'
        ELSE 
            CASE
                WHEN (date_part('year', now()) - (CAST('25' || SUBSTR(u.studentid, 1, 2) AS INTEGER)) + 544) < 4
                THEN CONCAT('นักศึกษา ', SUBSTR(u.studentid, 1, 2)) -- Show the first 2 digits of studentid
                ELSE to_char(date_part('year', now()) - (CAST('25' || SUBSTR(u.studentid, 1, 2) AS INTEGER)) + 544, '9999')
            END
    END AS class_year,
    COUNT(*) AS count_class_year
FROM users u
JOIN user_conseling_room1 ucr ON u.personid = ucr.personid
JOIN informationusers_room1 ir ON ucr.event_id = ir.event_id
WHERE ucr.start_datetime BETWEEN $1 AND $2 
AND u.gradelevel = 'ป.ตรี'
GROUP BY 
    CASE
        WHEN (date_part('year', now()) - (CAST('25' || SUBSTR(u.studentid, 1, 2) AS INTEGER)) + 544) > 4
        THEN 'มากกว่าปี 4'
        ELSE 
            CASE
                WHEN (date_part('year', now()) - (CAST('25' || SUBSTR(u.studentid, 1, 2) AS INTEGER)) + 544) < 4
                THEN CONCAT('นักศึกษา ', SUBSTR(u.studentid, 1, 2))
                ELSE to_char(date_part('year', now()) - (CAST('25' || SUBSTR(u.studentid, 1, 2) AS INTEGER)) + 544, '9999')
            END
    END;
`;
    const values = [startdate, enddate];
    const result = await client.query(text, values); // Using parameterized query for security

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

export const graphappointmentformajor = async (request) => {
  let client = await pool.connect();
  try {
    const { startdate, enddate } = request;

    if (!startdate && !enddate) {
      return { message: "Please provide a valid data" };
    }

    const text = `
    SELECT u.major, COUNT(*) AS major_count
    FROM users u
    JOIN user_conseling_room1 ucr ON u.personid = ucr.personid
    JOIN informationusers_room1 ir ON ucr.event_id = ir.event_id
    WHERE ucr.start_datetime BETWEEN $1 AND $2
    GROUP BY u.major;
`;

    const values = [startdate, enddate];
    const result = await client.query(text, values); // Using parameterized query for security

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

export const graphevaluation = async (request) => {
  let client = await pool.connect();
  try {
    const { startdate, enddate } = request;

    if (!startdate && !enddate) {
      return { message: "Please provide a valid data" };
    }

    const text = `
    SELECT topic, COUNT(click) AS click_count
     FROM clicksevaluationform cf
     WHERE datestimestamp BETWEEN $1 AND $2
     GROUP BY topic;
 `;

    const values = [startdate, enddate];
    const result = await client.query(text, values); // Using parameterized query for security

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





