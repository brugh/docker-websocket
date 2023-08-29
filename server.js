import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io'

const port = 3443;
const app = express();
app.use(cors({ origin: '*' }));

const server = createServer(app);
const io = new Server(server, {
  transports: ['websocket', 'polling'],
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  let username = `User ${Math.round(Math.random() * 999999)}`;
  console.log(`${username} connecting`)
  socket.emit('name', username);

  socket.on('message', (message) => {
    io.emit('message', {
      from: username,
      message: message,
      time: new Date().toLocaleString()
    });
  });
});

server.listen(port);