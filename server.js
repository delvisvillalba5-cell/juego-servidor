const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('Servidor multiplayer funcionando correctamente');
});

io.on('connection', (socket) => {
  console.log('Un jugador se ha conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
