import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(routes);

app.listen(port, () => console.log(`Quickstart app listening at http://localhost:${port}`));

export default app;
