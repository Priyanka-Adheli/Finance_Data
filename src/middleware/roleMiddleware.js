import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import User from '../models/UserModel.js';

const key = process.env.JWT_SECRET;

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token)
            throw new Error("Token Doesn't Exists");

        const payload = await jwt.verify(token, key);

        const { id } = payload;

        if (!id)
            throw new Error("Id Doesn't Exists");

        const result = await User.findById({ _id: id });

        if (!result)
            throw new Error("User Doesn't Exists");

        const IsBlocked = await redisClient.exists(`token:${token}`);

        if (IsBlocked)
            throw new Error("Unauthorized Access");

        req.result = result;

        next();
    }
    catch (err) {
        res.status(401).json({ message: "Unauthorized: " + err.message });
    }
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.result || !req.result.role) {
            return res.status(403).json({ message: "User role not found" });
        }
        if (!roles.includes(req.result.role)) {
            return res.status(403).json({ message: `Role: ${req.result.role} is not allowed to access these Records` });
        }
        next();
    };
};

export { userMiddleware, authorizeRoles };
