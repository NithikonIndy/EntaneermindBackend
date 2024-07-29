import { Elysia, } from 'elysia';
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
  insertaddtodatabase,
  checkadmin
} from "./controller/admin"

import {
  checkdata,
  insertinformation,
  afterlogin
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
  getidcalendar1
} from "./controller/appointment"

import {
  cancelappointmentroom2,
  getidcalendar2
} from "./controller/appointment2"

const app = new Elysia();
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
      const { cmuaccount } = request.body;
      return await checkadmin({ cmuaccount });
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
);








app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
