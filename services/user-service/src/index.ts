// src/index.ts

import express, { Request, Response } from 'express';
import mongoose  from 'mongoose';
import authRoutes from './routes/auth';


const app = express();
const PORT = 3000;

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
