// src/index.ts

import express from 'express';
import mongoose  from 'mongoose';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import * as redis from 'redis';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';


const app = express();
const PORT = 3000;
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

dotenv.config();

app.use(
    session({
        store: new RedisStore({ client: redisClient as any }),
        secret: process.env.REDIS_SECRET as string,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }
    })
);
app.use(cookieParser());
mongoose.connect(process.env.REGISTRATION_DATABASE as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as any).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);   
});

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.listen(PORT, () => {
    console.log(`User Service started on port ${PORT}`);
});

export default app;
