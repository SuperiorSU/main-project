import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import dbconnect from './config/dbConfig.js';
import memberRouter from './routes/memberRoute.js';
import adminRouter from './routes/adminRoute.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/members', memberRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('API is running...');
}
);

dbconnect();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});
