import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const connectionURL = process.env.DB_CONNECT;

async function main() {
    await mongoose.connect(connectionURL);
}

export default main;