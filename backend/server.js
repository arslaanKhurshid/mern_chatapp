// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from "cookie-parser";

// import cors from 'cors';

// import authRoutes from './routes/auth.routes.js';
// import messageRoutes from "./routes/message.routes.js";
// import userRoutes from './routes/user.routes.js';
// import connectToMongoDB from './db/connectToMongoDB.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json()); // Middleware for parsing JSON
// app.use(cookieParser());

// app.use(cors());

// app.use('/api/auth', authRoutes); // Registering auth routes
// app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);

// // app.get('/', (req, res) => {
// //     res.send('Welcome to the root route!');
// // });

// app.listen(PORT, () => {
//     connectToMongoDB();
//     console.log(`Server running on port ${PORT}`);
// });
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Initialize HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  const userId = socket.handshake.auth.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
