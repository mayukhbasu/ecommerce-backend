// src/index.ts

import express, { Request, Response } from 'express';
import mongoose  from 'mongoose';
import session from 'express-session';
import connectRedis from 'connect-redis';
import * as redis from 'redis';
import authRoutes from './routes/auth';


const app = express();
const PORT = 3000;
const RedisStore = connectRedis(session);
const redisClient = redis.createClient()

app.use(
    session({
        store: new RedisStore({ client: redisClient as any }),
        secret: 'yourSecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }
    })
);
mongoose.connect('mongodb://localhost:27017/registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as any).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);   
});

app.use(express.json());
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`User Service started on port ${PORT}`);
});

export default app;
