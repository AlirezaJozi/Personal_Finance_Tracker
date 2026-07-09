const db = require('../config/database');

const User = {
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    findByUsername: async (username) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },

    create: async (username, email, hashedPassword) => {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return result.insertId;
    }
};

module.exports = User;