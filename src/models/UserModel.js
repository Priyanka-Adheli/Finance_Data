import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["viewer", "analyst", "admin"],
        default: "viewer"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;