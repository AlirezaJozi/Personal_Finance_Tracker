const Transaction = require('../models/transactionModel');

exports.addTransaction = async (req, res) => {
    try {
        const { type, amount, category, description, transactionDate } = req.body;
        const userId = req.session.userId; // خواندن آیدی کاربر از روی سشن امن

        if (!type || !amount || !category || !transactionDate) {
            return res.status(400).json({ message: 'لطفاً فیلدهای اجباری را پر کنید.' });
        }

        const transactionId = await Transaction.create(userId, type, amount, category, description, transactionDate);
        res.status(201).json({ message: 'تراکنش با موفقیت ثبت شد.', transactionId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطایی در ثبت تراکنش رخ داد.' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const userId = req.session.userId;
        const transactions = await Transaction.findAllByUserId(userId);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطایی در دریافت تراکنش‌ها رخ داد.' });
    }
};

exports.getFinanceSummary = async (req, res) => {
    try {
        const userId = req.session.userId;
        const summary = await Transaction.getSummary(userId);

        const totalIncome = parseFloat(summary.totalIncome) || 0;
        const totalExpense = parseFloat(summary.totalExpense) || 0;
        const balance = totalIncome - totalExpense;

        res.status(200).json({ totalIncome, totalExpense, balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطایی در محاسبه خلاصه وضعیت رخ داد.' });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const userId = req.session.userId;

        const success = await Transaction.delete(transactionId, userId);
        if (!success) {
            return res.status(404).json({ message: 'تراکنش یافت نشد یا دسترسی مجاز نیست.' });
        }

        res.status(200).json({ message: 'تراکنش با موفقیت حذف شد.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطایی در حذف تراکنش رخ داد.' });
    }
};