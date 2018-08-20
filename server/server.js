var express = require('express');
var app = express();
var api = require("./api/api.js");
const path = require("path");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded( { extended: false }));
app.use(bodyParser.json());


app.use('/static', express.static(path.join(__dirname, 'build')))

app.use('/api', api );
app.listen( 3001, '0.0.0.0');


