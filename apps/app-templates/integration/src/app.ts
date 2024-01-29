import express from "express";
import bodyParser from "body-parser";
import {router} from "./routes";
import * as console from "console";
import * as dotenv from "dotenv";

dotenv.config()

const TAG = 'app';

const port = 8080;
const app = express();

app.use(bodyParser.json());
app.use(router);

app.listen(port, () => {
    console.log(`up and running listening on port:${port}`,  TAG, {});
});
