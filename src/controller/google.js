import { google } from 'googleapis';
import dotenv from 'dotenv';
import { pool } from '../lib/db';


dotenv.config(); // โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env

export const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    process.env.REDIRECT_URL
);

export const oauth2 = google.oauth2({
    version: 'v2',
    auth: oauth2Client
});


const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile' // เพื่อข้อมูลเพิ่มเติม
];

export const login = async (req, res) => {
    try {
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        return { redirectUrl: url }; // ส่ง URL กลับ
    } catch (error) {
        return { error: 'Error generating the authentication URL' };
    }
};

export const redirect = async (req, res) => {

    try {
        const code = req
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);
        const userInfo = await oauth2.userinfo.get();

        // if (tokens) {
        //     const { access_token, refresh_token, scope, token_type, expiry_date } = tokens;
        //     const text = 'INSERT INTO oauth_tokens(access_token,refresh_token, scope, token_type, expiry_date) VALUES($1, $2, $3, $4, $5) RETURNING *';
        //     const expiry = convertTimestampToThaiTime(expiry_date);
        //     const values = [access_token, refresh_token, scope, token_type, expiry_date];

        //     const client = await pool.connect();
        //     try {
        //       const res = await client.query(text, values);

        //       if (res.rowCount === 0) {
        //         return new NextResponse('tokens not found', { status: 404 });
        //       }

        //       return NextResponse.json({ res });
        //     } finally {
        //       client.release();
        //     }
        // }

        return { info: userInfo.data }; // ส่ง data กลับ

    } catch (error) {
        return res.json({ error: 'Error during authentication' });
    }
};
export const getbasicInfo = async () => {
    try {


        if (!accessToken) {
            return { error: 'Not authenticated' };
        }

        // ตั้งค่า access_token ให้กับ oauth2Client
        oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

        // เรียก API จาก Google หรือทำการตรวจสอบอื่นๆ
        // ตัวอย่าง: ตรวจสอบข้อมูลโปรไฟล์ผู้ใช้
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();

        return { message: 'Protected data', email: userInfo.data.email };
    } catch (error) {
        console.error('Error accessing protected route:', error);
        return { error: 'Access denied' };
    }
}




export const calendars = async (request, res) => {
    try {

        calendar.calendarList.list({}, (err, response) => {
            if (err) {
                // Handle error if the API request fails
                console.error('Error fetching calendars', err);
                return;
            }
            // Send the list of calendars as JSON
            const calendars = response.data.items;
            console.log(calendars);

            return { message: 'show' };
        });
    } catch (error) {
        return { error: 'Error during authentication' };
    }

};


export const events = async () => {
    let client = await pool.connect();
    try {
        const result = await client.query('SELECT access_token, refresh_token, scope, token_type, expiry_date FROM oauth_tokens');
        const tokens = result.rows[0];

        if (!tokens) {
            console.log("error");

        }

        oauth2Client.setCredentials(tokens);

        const calendarId = "nithikon1404@gmail.com"; // assuming req contains a calendarId property

        const cmuAccount = "nithikon_jansanitsri@cmu.ac.th";

        const room = "conseling_room1";

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // List events from the specified calendar
        const response = await calendar.events.list({
            calendarId: calendarId,
            timeMin: (new Date()).toISOString(),
            maxResults: 15,
            singleEvents: true,
            orderBy: 'startTime'
        });


        // Check if response data and items are defined
        if (!response.data || !response.data.items) {
            console.error('No events found in the response', response);
            // return new NextResponse('No events found!', { status: 404 });
        }

        const searchAdmin = await client.query('SELECT * FROM admins WHERE cmuAccount = $1', [cmuAccount]);
        const personIdAdmin = searchAdmin.rows[0].personid;


        const events = response.data.items;

        // Insert each event individually
        for (const event of events) {
            const startDateTime = event.start?.dateTime;
            const endDateTime = event.end?.dateTime;
            const eventId = event.id;

            if (startDateTime && endDateTime && eventId) {
                // Check if the event already exists in the database
                const checkExisting = await client.query('SELECT event_id FROM admin_conseling_room1 WHERE event_id = $1', [eventId]);

                if (checkExisting.rowCount === 0) {
                    // Insert the event if it does not exist
                    const text = 'INSERT INTO admin_conseling_room1(event_id, start_datetime, end_datetime, room, personid) VALUES($1, $2, $3, $4, $5) RETURNING *';
                    const values = [eventId, startDateTime, endDateTime, room, personIdAdmin];

                    await client.query(text, values);
                }
            }

            const queryCalendar = await client.query('SELECT event_id FROM admin_conseling_room1');
            const checkCalendar = queryCalendar.rows.map(row => row.event_id);

            for (const eventId of checkCalendar) {
                if (!events.some(event => event.id === eventId)) {
                    // EventId exists in the database but not in the current events from Google Calendar
                    console.log("this is eventId", eventId);

                    try {
                        await client.query('DELETE FROM admin_conseling_room1 WHERE event_id = $1', [eventId]);
                    } catch (deleteError) {
                        console.error("Error deleting event from the database:", deleteError);
                    }
                }
            }

        }

        //   return NextResponse.json(events);
        // return events
    } catch (err) {
        console.error('Error executing query:', err);
        // throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};

export const events2 = async () => {
    let client = await pool.connect();
    try {
        const result = await client.query('SELECT access_token, refresh_token, scope, token_type, expiry_date FROM oauth_tokens');
        const tokens = result.rows[0];

        if (!tokens) {
            console.log("error");

        }

        oauth2Client.setCredentials(tokens);

        const calendarId = "nithikon440@gmail.com"; // assuming req contains a calendarId property

        const cmuAccount = "nithikon_jansanitsri@cmu.ac.th";

        const room = "conseling_room2";

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // List events from the specified calendar
        const response = await calendar.events.list({
            calendarId: calendarId,
            timeMin: (new Date()).toISOString(),
            maxResults: 15,
            singleEvents: true,
            orderBy: 'startTime'
        });

        // Check if response data and items are defined
        if (!response.data || !response.data.items) {
            console.error('No events found in the response', response);
            return new NextResponse('No events found!', { status: 404 });
        }

        const searchAdmin = await client.query('SELECT * FROM admins WHERE cmuAccount = $1', [cmuAccount]);
        const personIdAdmin = searchAdmin.rows[0].personid;

        const events = response.data.items;


        // Insert each event individually
        for (const event of events) {
            const startDateTime = event.start?.dateTime;
            const endDateTime = event.end?.dateTime;
            const eventId = event.id;

            if (startDateTime && endDateTime && eventId) {
                // Check if the event already exists in the database
                const checkExisting = await client.query('SELECT event_id FROM admin_conseling_room2 WHERE event_id = $1', [eventId]);

                if (checkExisting.rowCount === 0) {
                    // Insert the event if it does not exist
                    const text = 'INSERT INTO admin_conseling_room2(event_id, start_datetime, end_datetime, room, personid) VALUES($1, $2, $3, $4, $5) RETURNING *';
                    const values = [eventId, startDateTime, endDateTime, room, personIdAdmin];

                    await client.query(text, values);
                }
            }


            const queryCalendar = await client.query('SELECT event_id FROM admin_conseling_room2');
            const checkCalendar = queryCalendar.rows.map(row => row.event_id);

            for (const eventId of checkCalendar) {
                if (!events.some(event => event.id === eventId)) {
                    // EventId exists in the database but not in the current events from Google Calendar
                    console.log("this is eventId", eventId);

                    try {
                        await client.query('DELETE FROM admin_conseling_room2 WHERE event_id = $1', [eventId]);
                    } catch (deleteError) {
                        console.error("Error deleting event from the database:", deleteError);
                    }
                }
            }

        }

        //   return NextResponse.json(events);
        // return events
    } catch (err) {
        console.error('Error executing query:', err);
        // throw new Error('Failed to fetch data');
    } finally {
        if (client) {
            client.release(); // ปลดปล่อยการเชื่อมต่อ
        }
    }
};

export const createevent = async (request) => {
    try {
        const { description, startDateTime, endDateTime } = request;

        if (!description || !startDateTime || !endDateTime) {
            return new NextResponse('Missing required event details!', { status: 400 });
        }

        const event = {
            'summary': 'Entaneer Mind นัดปรึกษา',
            'location': 'conseling_room1',
            'description': description,
            'start': {
                'dateTime': startDateTime,
                'timeZone': 'Asia/Bangkok',
            },
            'end': {
                'dateTime': endDateTime,
                'timeZone': 'Asia/Bangkok',
            },
            'attendees': [],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'popup', 'minutes': 10 },
                ],
            },
        };

        const client = await pool.connect();
        try {
            const result = await client.query('SELECT access_token, refresh_token, scope, token_type, expiry_date FROM oauth_tokens');
            const tokens = result.rows[0];

            if (!tokens) {
                return new NextResponse('No found tokens!', { status: 404 });
            }

            oauth2Client.setCredentials(tokens);

            const calendarId = "nithikon1404@gmail.com"; // assuming req contains a calendarId property

            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            return calendar.events.insert({
                calendarId: calendarId,
                requestBody: event,
            }).then((response) => {
                console.log('Event created: %s', response.data);
                return new NextResponse(JSON.stringify({ message: "Event successfully created!" }), { status: 200 });
            }).catch((err) => {
                console.error('There was an error contacting the Calendar service:', err);
                return new NextResponse('Error creating event', { status: 500 });
            });

        } catch (error) {
            console.error("Can't insert events", error);
            return new NextResponse('Error', { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error parsing request', error);
        return new NextResponse('Invalid request body!', { status: 400 });
    }
};

export const createevent2 = async (request) => {
    try {
        const { description, startDateTime, endDateTime } = request;

        if (!description || !startDateTime || !endDateTime) {
            return new NextResponse('Missing required event details!', { status: 400 });
        }

        const event = {
            'summary': 'Entaneer Mind นัดปรึกษา',
            'location': 'conseling_room2',
            'description': description,
            'start': {
                'dateTime': startDateTime,
                'timeZone': 'Asia/Bangkok',
            },
            'end': {
                'dateTime': endDateTime,
                'timeZone': 'Asia/Bangkok',
            },
            'attendees': [],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'popup', 'minutes': 10 },
                ],
            },
        };

        const client = await pool.connect();
        try {
            const result = await client.query('SELECT access_token, refresh_token, scope, token_type, expiry_date FROM oauth_tokens');
            const tokens = result.rows[0];

            if (!tokens) {
                return new NextResponse('No found tokens!', { status: 404 });
            }

            oauth2Client.setCredentials(tokens);

            const calendarId = "nithikon440@gmail.com"; // assuming req contains a calendarId property

            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            return calendar.events.insert({
                calendarId: calendarId,
                requestBody: event,
            }).then((response) => {
                console.log('Event created: %s', response.data);
                // return new NextResponse(JSON.stringify({ message: "Event successfully created!" }), { status: 200 });
            }).catch((err) => {
                console.error('There was an error contacting the Calendar service:', err);
                // return new NextResponse('Error creating event', { status: 500 });
            });

        } catch (error) {
            console.error("Can't insert events", error);
            return new NextResponse('Error', { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error parsing request', error);
        return new NextResponse('Invalid request body!', { status: 400 });
    }
};

export const deleteevent = async (request) => {
    const client = await pool.connect();

    try {
        const result = await client.query('SELECT access_token, refresh_token, scope, token_type, expiry_date FROM oauth_tokens');
        const tokens = result.rows[0];

        if (!tokens) {
            return new NextResponse('No found tokens!', { status: 404 });
        }

        oauth2Client.setCredentials(tokens);
        const { event_id } = request;

        // console.log("This is eventId ",event_id);


        const GOOGLE_CALENDAR_ID = "nithikon1404@gmail.com";
        const GOOGLE_EVENT_ID = event_id;
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        await calendar.events.delete({
            calendarId: GOOGLE_CALENDAR_ID,
            eventId: GOOGLE_EVENT_ID,
        });

        return NextResponse.json({ message: "Event successfully deleted!" });
    } catch (error) {
        console.log("Can't Delete ", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
};

export const deleteevent2 = async (request) => {
    const client = await pool.connect();

    try {
        const result = await client.query('SELECT access_token, refresh_token, scope, token_type, expiry_date FROM oauth_tokens');
        const tokens = result.rows[0];

        if (!tokens) {
            return new NextResponse('No found tokens!', { status: 404 });
        }

        oauth2Client.setCredentials(tokens);
        const { event_id } = request;

        // console.log("This is eventId ",event_id);


        const GOOGLE_CALENDAR_ID = "nithikon440@gmail.com";
        const GOOGLE_EVENT_ID = event_id;
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        await calendar.events.delete({
            calendarId: GOOGLE_CALENDAR_ID,
            eventId: GOOGLE_EVENT_ID,
        });

        return NextResponse.json({ message: "Event successfully deleted!" });
    } catch (error) {
        console.log("Can't Delete ", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
};



