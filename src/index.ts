import express from 'express';
import bodyParser  from 'body-parser';
import firebaseRoute from './routes/FireBaseRoute'

const app = express();
const PORT = 3009;

app.use(bodyParser.json());

app.use("/demo", firebaseRoute)
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})