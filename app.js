const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const http = require('http');
const server = http.Server(app);

const config = require('./server/config/index');
const routes = require('./server/router/index');

const io = require('socket.io')(server);
// mongoose.connect(config.DB);

// app.use(express.static(__dirname + 'public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'))

app.use('/api', routes);

io.on('connection', (socket) => {
  console.log('User connected');
});


// server setup
const PORT = process.env.PORT || 3000 ;
server.listen(PORT, () => {
  console.log(`Magic happens on port ${PORT}`)
});