import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

const database = process.env.MONGODB_URI != undefined ? process.env.MONGODB_URI : "mongodb://127.0.0.1:27017/chat";
mongoose.connect(database, 
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

