import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';

import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

app.use(cors({ credentials: true }));

app.use(userRoutes);
app.use(authRoutes);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log(`message: ${msg}`);

    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => console.log('user disconnected'));
});

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
