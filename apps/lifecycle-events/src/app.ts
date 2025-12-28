import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import routes from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use("/", routes);

app.listen(port, () => {
  console.log(`Lifecycle Events app listening at http://localhost:${port}`);
});

export default app;
