const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Evitar caché en index.html para ver siempre la última versión
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Servir archivos estáticos de la carpeta actual
app.use(express.static(path.join(__dirname), { maxAge: 0 }));

io.on('connection', (socket) => {
  console.log('Un jugador se ha conectado:', socket.id);

  socket.on('JOIN_ROOM', (data) => {
    if (!data || !data.roomId) return;
    socket.join(data.roomId);
    console.log(`Jugador ${data.playerId} se unió a ${data.roomId}`);
    socket.emit('ROOM_JOINED', { success: true, roomId: data.roomId });
  });

  socket.on('MOVE', (data) => {
    if (!data) return;
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
