import { Elysia, } from 'elysia';
import { cors } from '@elysiajs/cors'
import {
  graphmentalhealthchecklist,
  graphappointmentforgradelevel,
  graphappointmentforbachelordegree,
  graphappointmentformajor,
  graphevaluation
}
  from './controller/graph';
import {
  getinformationusers,
  listinformation,
  listinformationdetail
}
  from "./controller/userinformation"


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
);





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
