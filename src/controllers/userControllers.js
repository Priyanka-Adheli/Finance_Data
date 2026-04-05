import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import redisClient from "../config/redis.js";
import generateToken from "../utils/generateToken.js";
import validate from "../utils/validator.js";


//to register user with default as role viewer
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //validate the required fields
        validate({ name, email, password });

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create the user
        const user = await UserModel.create({ name, email, password: hashedPassword });

        //generate jwt token for 7days and sending as response
        const token = generateToken(user._id, user.role);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ user, token });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//login 
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new Error("User Not Found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid Password");
        }

        //generate the jwt token
        const token = generateToken(user._id, user.role);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ user, token });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//logout
const logoutUser = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token Not Found");
        }

        //setting the token as blocked token
        await redisClient.set(`token:${token}`, "logout", "EX", 7 * 24 * 60 * 60);

        res.clearCookie("token");
        res.status(200).json({ message: "Logout Successful" });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//change role by admin to specific userid
const assignRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            throw new Error("User Not Found");
        }

        user.role = role;
        await user.save();
        res.status(200).json({ user });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//change status by admin to specific userid
const changeUserStatus = async (req, res) => {
    try {
        const { userId, isActive } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            throw new Error("User Not Found");
        }
        
        user.isActive = isActive;
        await user.save();
        res.status(200).json({ user });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get all the users info
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({ users });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    assignRole,
    changeUserStatus,
    getAllUsers
}