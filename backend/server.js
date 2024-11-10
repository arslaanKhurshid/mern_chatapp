import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from "./routes/message.routes.js";
import userRoutes from './routes/user.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Middleware for parsing JSON
app.use(cookieParser());

app.use(cors());

app.use('/api/auth', authRoutes); // Registering auth routes
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get('/', (req, res) => {
//     res.send('Welcome to the root route!');
// });

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`);
});
