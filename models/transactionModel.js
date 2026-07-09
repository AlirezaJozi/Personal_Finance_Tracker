const db = require('../config/database');

const Transaction = {
    create: async (userId, type, amount, category, description, transactionDate) => {
        const [result] = await db.execute(
            'INSERT INTO transactions (user_id, type, amount, category, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, type, amount, category, description, transactionDate]
        );
        return result.insertId;
    },

    findAllByUserId: async (userId) => {
        const [rows] = await db.execute(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC',
            [userId]
        );
        return rows;
    },

    delete: async (id, userId) => {
        const [result] = await db.execute(
            'DELETE FROM transactions WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    },

    getSummary: async (userId) => {
        const [rows] = await db.execute(
            `SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
             FROM transactions WHERE user_id = ?`,
            [userId]
        );
        return rows[0];
    }
};

module.exports = Transaction;