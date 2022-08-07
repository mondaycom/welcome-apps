import express from "express";
import http from "http";
import bodyParser from "body-parser";

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());


app.post("/", function(req, res) { 
    console.log(JSON.stringify(req.body, 0, 2));    
    res.status(200).send(req.body);
    }
)

server.listen(process.env.PORT || 3000, function() {
	console.log('Express server listening on port 3000.');
})