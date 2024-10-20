import express from 'express';
import http from 'http';
import ip from 'ip';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000; // Utilisation de la variable d'environnement PORT ou 3000 par défaut
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());

app.get('/', (req, res) => {
  res.json('ip address: http://' + ip.address() + ':' + PORT);    
});

io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  socket.on("message", (data) => {
    const { username, message } = data;
    console.log(`${username} a envoyé un message : ${message}`);

    io.emit("message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Ready on http://localhost:${PORT}`);
});
