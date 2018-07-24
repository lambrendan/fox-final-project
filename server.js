var express = require('express');
var app = express();
var api = require("./api.js");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded( { extended: false }));
app.use(bodyParser.json());

app.use('/api', api );
app.listen( 3001, '0.0.0.0');