const express = require('express');
const dotenv = require('dotenv').config();
var bodyParser = require('body-parser')
const routes = require('./routes');
const triggerController = require('./controllers/trigger-controller');

const app = express();
const port = process.env.PORT;
// parse various different custom JSON types as JSON
app.use(bodyParser.json())
app.use(routes);
app.listen(port, () => {
    console.log(`Quickstart app listening at http://localhost:${port}`);
    try {
        triggerController.initialize(5);   
    } catch (error) {
        console.log(error);
    }
})

module.exports = app;
