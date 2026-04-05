import Finance from '../models/FinanceModel.js';
import { validateFinance } from '../utils/validator.js';

//function to create Finance record
const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;
        const user = req.result._id;

        validateFinance({ amount, type, category, date });

        const record = await Finance.create({
            amount,
            type,
            category,
            date,
            description,
            user
        });

        res.status(201).json({ record });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//function to build the filter query based on query parameters
const buildFilterQuery = (queryObj, initialQuery = {}) => {
    const { type, category, startDate, endDate } = queryObj;
    let query = { ...initialQuery };

    if (type) query.type = type;
    if (category) query.category = category;

    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
        query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
        query.date = { $lte: new Date(endDate) };
    }

    return query;
};

//get all the finance records
const getAllRecords = async (req, res) => {
    try {
        const query = buildFilterQuery(req.query);

        const records = await Finance.find(query).populate('user', 'name email role');
        res.status(200).json({ records });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get user specific Finance record
const getUserRecords = async (req, res) => {
    try {
        if (!req.result._id)
            return res.status(500).json({ message: "user Id Doesn't exists" });

        const user = req.result._id;
        const query = buildFilterQuery(req.query, { user });

        const records = await Finance.find(query);
        res.status(200).json({ records });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update Finance record
const updateRecord = async (req, res) => {
    try {
        const { id } = req.params;
        
        validateFinance(req.body, true);
        
        const record = await Finance.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        res.status(200).json({ record });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete Finance record
const deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Finance.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        res.status(200).json({ message: "Record deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Dashboard Summary
const getDashboardSummary = async (req, res) => {
    try {
        //Aggregate totals by type
        const totals = await Finance.aggregate([
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpenses = 0;

        totals.forEach(t => {
            if (t._id === 'income') totalIncome = t.totalAmount;
            if (t._id === 'expense') totalExpenses = t.totalAmount;
        });

        const netBalance = totalIncome - totalExpenses;

        //Category wise total display
        const categoryTotals = await Finance.aggregate([
            {
                $group: {
                    _id: { type: "$type", category: "$category" },
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        //recent activity showing recent 5 finance records
        const recentActivity = await Finance.find().sort({ date: -1 }).limit(5).populate('user', 'name');

        res.status(200).json({
            summary: {
                totalIncome,
                totalExpenses,
                netBalance
            },
            categoryTotals,
            recentActivity
        });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createRecord,
    getAllRecords,
    getUserRecords,
    updateRecord,
    deleteRecord,
    getDashboardSummary
};
