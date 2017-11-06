var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./server/config/index');
var routes = require('./server/router/index');

mongoose.connect(config.DB);

// app.use(express.static(__dirname + 'public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => {
  console.log(`Magic happens on port ${PORT}`)
});