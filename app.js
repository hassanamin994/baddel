const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const http = require('http');
const server = http.Server(app);

const passportService = require('./server/services/passport');
const passport = require('passport');
const config = require('./server/config/index');
const routes = require('./server/router/index');
const cors = require('cors');
const io = require('socket.io')(server);
var clientInfo = {};

mongoose.connect(config.DB);

app.use(cors());
app.use(express.static(__dirname + 'public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(passport.initialize());

app.use('/api', routes);

// io.on('connection', (socket) => {
//   console.log('User connected');

//   socket.on('message', (message) => {
//     io.to(clientInfo[socket.id].room).emit('message', message);
//   })

//   socket.on('joinRoom', (req) => {
//     clientInfo[socket.id] = req;
//     socket.join(req.room);
//     socket.broadcast.to(req.room).emit('message', {
//       name: 'System',
//       text: req.name + ' has joined!'
//     })
//   });

//   socket.on('disconnect', () => {
//     var userData = clientInfo[socket.id];
//     if (userData) {
//       socket.leave(userData.room);
//       io.to(userData.room).emit('message', {
//         name: 'System',
//         text: userData.name + ' has left!'
//       })
//       delete clientInfo[socket.id];
//     }
//   });

// });


// server setup
const PORT = process.env.PORT || 3000 ;
server.listen(PORT, () => {
  console.log(`Magic happens on port ${PORT}`)
});