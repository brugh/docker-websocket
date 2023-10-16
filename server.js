import express from 'express';
import cors from 'cors';
import fs from 'fs';

import { createServer } from 'https';
import { Server } from 'socket.io'

const port = 3443;
const app = express();
app.use(cors({ origin: '*' }));

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

const server = createServer({cert: certificate, key: privateKey},app);
const io = new Server(server, {
  server: server,
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