const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir la carpeta actual (donde está index.html)
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
  console.log('Un jugador se ha conectado:', socket.id);

  socket.on('JOIN_ROOM', (data) => {
    socket.join(data.roomId);
    console.log(`Jugador ${data.playerId} se unió a ${data.roomId}`);
    socket.emit('ROOM_JOINED', { success: true, roomId: data.roomId });
  });

  socket.on('MOVE', (data) => {
    // Reenviar movimiento a todos en la sala
    io.emit('PLAYER_MOVED', { playerId: socket.id, x: data.x, y: data.y });
  });

  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
