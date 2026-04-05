import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import redisClient from './config/redis.js';

import userRoutes from './routes/userRoutes.js';
import financeRoutes from './routes/financeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

//user routes
app.use('/api/users', userRoutes);

//finance data routes
app.use('/api/finance', financeRoutes);



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});


const InitializeComponent = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB successfully");

        await redisClient.connect();
        console.log("Connected to Redis successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

InitializeComponent();
