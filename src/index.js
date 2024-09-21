import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors'

import {
  graphmentalhealthchecklist,
  graphappointmentforgradelevel,
  graphappointmentforbachelordegree,
  graphappointmentformajor,
  graphevaluation,

}
  from './controller/graph';
import {
  getinformationusers,
  listinformation,
  listinformationdetail,
  detailinformation,
  updateinformation
}
  from "./controller/userinformation"

import {
  getinformationusers2,
  listinformation2,
  listinformationdetail2,
  detailinformation2,
  updateinformation2
} from "./controller/userinformation2"

import {
  insertaddtodatabase,
  checkadmin,
  closetimeslot,
  closetimeslot2,
  gettimeroom,
  deltimeroom,
  gettimeroom2,
  deltimeroom2,
} from "./controller/admin"

import {
  checkdata,
  insertinformation,
  afterlogin,
  getmailandtime,
} from "./controller/user"

import {
  insertaccesscode,
  checkaccesscode,
  deleteautoaccesscode,
  deletemulaccesscode
} from "./controller/accesscode"

import {
  clickevaluation
} from "./controller/evaluation"

import {
  listhistoryappointment,
  cancelappointmentroom1,
  getidcalendar1,
  checkappointment,
  addtimeappointment
} from "./controller/appointment"

import {
  cancelappointmentroom2,
  getidcalendar2,
  checkappointment2,
  addtimeappointment2
} from "./controller/appointment2"

import {
  login,
  redirect,
  calendars,
  getbasicInfo,
  oauth2Client,
  events,
  events2,
  createevent,
  deleteevent,
  createevent2,
  deleteevent2,
} from "./controller/google"

import {
  addimg
} from "./controller/article"

import {
  RegisteredVillageController,
  getimg,
  test,
  getimgtest
} from "./controller/image"



const app = new Elysia()


const port = 3001;


app.use(cors({
  origin: ['http://localhost:3000'],
  methods: 'GET, POST, PUT, DELETE, PATCH',
  credentials: true,
}));




app.get('/', () => ({
  message: 'Hello World!',
}));

// Grouping APIs related to graphs
app.group(
  'api/graph',
  {},
  (app) => app
    .post('/appointment-for-grade-level', async (request) => {
      const { startdate, enddate } = request.body;
      return await graphappointmentforgradelevel({ startdate, enddate });
    })
    .post('/mental-health-checklist', async (request) => {
      const { startdate, enddate } = request.body;
      return await graphmentalhealthchecklist({ startdate, enddate });
    })
    .post('/graphappointmentforbachelordegree', async (request) => {
      const { startdate, enddate } = request.body;
      return await graphappointmentforbachelordegree({ startdate, enddate });
    })
    .post('/graphappointmentformajor', async (request) => {
      const { startdate, enddate } = request.body;
      return await graphappointmentformajor({ startdate, enddate });
    })
    .post('/graphevaluation', async (request) => {
      const { startdate, enddate } = request.body;
      return await graphevaluation({ startdate, enddate });
    })

);

// Grouping APIs related to information
app.group(
  'api/infor',
  {},
  (app) => app
    .get('/getinformationusers', async () => {
      return await getinformationusers();
    })
    .post('/list', async (request) => {
      const { date } = request.body;
      return await listinformation({ date });
    })
    .post('/listdetail', async (request) => {
      const { studentid } = request.body;
      return await listinformationdetail({ studentid });
    })
    .post('/detailinfor/:id', async (request) => {
      const { id } = request.params;
      return await detailinformation({ id });
    })
    .put('/editinfor/:id', async (request) => {
      const { details_consultation, mental_health_checklist, mental_risk_level } = request.body;
      const { id } = request.params;
      return await updateinformation({ details_consultation, mental_health_checklist, mental_risk_level, id });
    })
);

app.group(
  'api/infor2',
  {},
  (app) => app
    .get('/getinformationusers', async () => {
      return await getinformationusers2();
    })
    .post('/list', async (request) => {
      const { date } = request.body;
      return await listinformation2({ date });
    })
    .post('/listdetail', async (request) => {
      const { studentid } = request.body;
      return await listinformationdetail2({ studentid });
    })
    .post('/detailinfor/:id', async (request) => {
      const { id } = request.params;
      return await detailinformation2({ id });
    })
    .put('/editinfor/:id', async (request) => {
      const { details_consultation, mental_health_checklist, mental_risk_level } = request.body;
      const { id } = request.params;
      return await updateinformation2({ details_consultation, mental_health_checklist, mental_risk_level, id });
    })
);


// Grouping APIs related to information
app.group(
  'api/admin',
  {},
  (app) => app
    .post('/firstlogin', async (request) => {
      const { name, cmuaccount, studentid, organization_name, accounttype } = request.body;
      return await insertaddtodatabase({ name, cmuaccount, studentid, organization_name, accounttype });
    })
    .put('/checkadmin', async (request) => {
      const { cmuAccount } = request.body;
      return await checkadmin({ cmuAccount });
    })
    .post('/closetimeslot', async (request) => {
      const { start_datetime, end_datetime, personid, room } = request.body;
      return await closetimeslot({ start_datetime, end_datetime, personid, room });
    })
    .post('/closetimeslot2', async (request) => {
      const { start_datetime, end_datetime, personid } = request.body;
      return await closetimeslot2({ start_datetime, end_datetime, personid });
    })
    .get('/gettimeroom', async () => {
      return await gettimeroom();
    })
    .delete('/deltimeroom', async () => {
      return await deltimeroom();
    })
    .get('/gettimeroom2', async () => {
      return await gettimeroom2();
    })
    .delete('/deltimeroom2', async () => {
      return await deltimeroom2();
    })

);



// Grouping APIs related to User
app.group(
  'api/user',
  {},
  (app) => app
    .post('/checkuser', async (request) => {
      const { studentId } = request.body;
      return await checkdata({ studentId });
    })
    .put('/firstlogin', async (request) => {
      const { personid, studentId, phone, major, gender, facebookurl, gradelevel } = request.body;
      return await insertinformation({ personid, studentId, phone, major, gender, facebookurl, gradelevel });
    })
    .post('/afterlogin', async (request) => {
      const { personid, name, cmuaccount, studentid, organization_name, accounttype } = request.body;
      return await afterlogin({ personid, name, cmuaccount, studentid, organization_name, accounttype });
    })
    .post('/clickevaluation', async (request) => {
      const { topic } = request.body;
      return await clickevaluation({ topic });
    })
    .get('/getmailandtime', async () => {
      return await getmailandtime();
    })


);

// Grouping APIs related to Accesscode
app.group(
  'api/accesscode',
  {},
  (app) => app
    .post('/insertaccesscode', async (request) => {
      const { accesscode } = request.body;
      return await insertaccesscode({ accesscode });
    })
    .put('/checkaccesscode', async (request) => {
      const { accesscode } = request.body;
      return await checkaccesscode({ accesscode });
    })
    .delete('/deleteautoaccesscode', async () => {

      return await deleteautoaccesscode();
    })
    .put('/deletemulaccesscode', async (request) => {
      const { accesscode } = request.body;
      return await deletemulaccesscode({ accesscode });
    })

);

app.group(
  'api/appointment',
  {},
  (app) => app
    .put('/listhistory', async (request) => {
      const { studentid } = request.body;
      return await listhistoryappointment({ studentid });
    })
    .delete('/cancel', async (request) => {
      const { event_id } = request.body;
      return await cancelappointmentroom1({ event_id });
    })
    .put('/getidcalendar', async (request) => {
      const { start_datetime, end_datetime } = request.body;
      return await getidcalendar1({ start_datetime, end_datetime });
    })
    .put('/checkappointment', async (request) => {
      const { studentid } = request.body;
      return await checkappointment({ studentid });
    })
    .post('/addtimeappointment', async (request) => {
      const { start_datetime, end_datetime, personid, topic } = request.body;
      return await addtimeappointment({ start_datetime, end_datetime, personid, topic });
    })
);

app.group(
  'api/appointment2',
  {},
  (app) => app
    .delete('/cancel', async (request) => {
      const { event_id } = request.body;
      return await cancelappointmentroom2({ event_id });
    })
    .put('/getidcalendar', async (request) => {
      const { start_datetime, end_datetime } = request.body;
      return await getidcalendar2({ start_datetime, end_datetime });
    })
    .put('/checkappointment', async (request) => {
      const { studentid } = request.body;
      return await checkappointment2({ studentid });
    })
    .post('/addtimeappointment', async (request) => {
      const { start_datetime, end_datetime, personid, topic } = request.body;
      return await addtimeappointment2({ start_datetime, end_datetime, personid, topic });
    })
);



app.group(
  '/api/google',
  {},
  (app) => app
    .get('/login', async ({ request, response }) => {
      const result = await login(request, response);
      if (result) {
        return result.redirectUrl;
      } else {
        return result; // Return error message if any
      }
    })
    .post('/redirect', async (req) => {
      const { code } = await req.body;
      return await redirect(code);
    })
    .get('/events', async () => {
      return await events();
    })
    .get('/events2', async () => {
      return await events2();
    })
    .post('/createevent', async (req) => {
      const { description, startDateTime, endDateTime } = await req.body;
      return await createevent({ description, startDateTime, endDateTime });
    })
    .post('/createevent2', async (req) => {
      const { description, startDateTime, endDateTime } = await req.body;
      return await createevent2({ description, startDateTime, endDateTime });
    })
    .put('/deleteevent', async (req) => {
      const { event_id } = await req.body;
      return await deleteevent({ event_id });
    })
    .put('/deleteevent2', async (req) => {
      const { event_id } = await req.body;
      return await deleteevent2({ event_id });
    })


  // .get('/getinfo', async ({ request, response }) => {
  //   return await getbasicInfo();
  // })
  // .get('/calendars', async ({ request, response }) => {
  //   return await calendars()
  // })


);



// app.group(
//   'api/img',
//   {},
//   (app) => app
//   .post(
//     "/upload",
//     async ({ body }) => {
//       return RegisteredVillageController.addVillages(body);
//     },
//     {
//       tags: ["Registered_Village"],
//       body: t.Object({
//         logo: t.File({ description: "logo" }), // แค่ฟิลด์ logo เท่านั้น
//       }),
//       type: "formdata",
//       required: ["logo"], // ระบุว่าฟิลด์ logo เป็นสิ่งจำเป็น
//     }
//   )

//   .get('/get/:id', getimg)
// );

app.group(
  'api/img',
  {},
  (app) => app
    .post(
      "/upload",
      async (req) => {
        const { logo, text_content } = req.body; // ดึงข้อมูลจาก body
        return test.addVillages({ logo, text_content });
      },
      {
        tags: ["Registered_Village"],
        body: t.Object({
          logo: t.File({ description: "logo" }), // ฟิลด์ logo
          text_content: t.String({ description: "Text Content" }), // เพิ่มฟิลด์ text_content
        }),
        type: "formdata",
        required: ["logo", "text_content"], // ระบุว่าฟิลด์ logo และ text_content เป็นสิ่งจำเป็น
      }
    )
    .get('/get', getimgtest)

);







app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
