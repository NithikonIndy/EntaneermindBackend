import { google } from 'googleapis';
import dotenv from 'dotenv';

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

export const redirect = async ( req, res ) => {
    
    try {        
        const code = req
        const { tokens } = await oauth2Client.getToken(code);
    
        oauth2Client.setCredentials(tokens);
        const userInfo = await oauth2.userinfo.get();

       return {  info: userInfo.data}; // ส่ง data กลับ
       
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

        console.log("mydata", userInfo.data);


        return { message: 'Protected data', email: userInfo.data.email };
    } catch (error) {
        console.error('Error accessing protected route:', error);
        return { error: 'Access denied' };
    }
}

export const logout = async (req, res) => {
    res.setHeader('Set-Cookie', [
        'accessToken=; HttpOnly; Secure; Max-Age=0',
        'refreshToken=; HttpOnly; Secure; Max-Age=0'
    ]);

    return { message: 'Logged out' };
};


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

export const getevent = async (request, res) => {
    try {
        const calendarId = "nithikon1404@gmail.com";


        // List events from the specified calendar
        const response = await calendar.events.list({
            calendarId: calendarId,
            timeMin: (new Date()).toISOString(),
            maxResults: 15,
            singleEvents: true,
            orderBy: 'startTime'
        });

        const events = response.data.items;
    } catch (error) {
        return { error: 'Error during authentication' };
    }

};



