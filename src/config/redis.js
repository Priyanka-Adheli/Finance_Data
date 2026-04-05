import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();

const password = process.env.REDIS_KEY;
const hostName = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;

//Connecting to redisClient
const redisClient = createClient({
    username: 'default',
    password: password,
    socket: {
        host: hostName,
        port: port
    }
});

export default redisClient;