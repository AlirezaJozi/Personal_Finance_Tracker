const express = require('express');
const session = require('express-session');
const path = require('path');
const transactionRoutes = require('./routes/transactionRoutes');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/transactions', transactionRoutes);
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // اگر HTTPS بود باید true شود
        maxAge: 1000 * 60 * 60 * 24 // اعتبار کوکی: ۲۴ ساعت
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running perfectly on http://localhost:${PORT}`);
});