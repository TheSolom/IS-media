import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import cors from 'cors';
import helmet from "helmet";
import morgan from "morgan";

import errorMiddleware from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import storyRoutes from './routes/storyRoutes.js';

const app = express();
const server = createServer(app);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));

app.use(cors({ origin: 'https://is-media.vercel.app', credentials: true }));

app.use(helmet());

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));
else app.use(morgan("combined"));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/stories', storyRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT);
