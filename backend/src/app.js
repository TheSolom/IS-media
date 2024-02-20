import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';

import errorMiddleware from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import postRoutes from './routes/postRoutes.js';
import storyRoutes from './routes/storyRoutes.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/stories', storyRoutes);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log(`message: ${msg}`);

    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => console.log('user disconnected'));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
