import mongoose from "mongoose";
const { Schema } = mongoose;

const financeSchema = Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const FinanceModel = mongoose.model("Finance", financeSchema);
export default FinanceModel;