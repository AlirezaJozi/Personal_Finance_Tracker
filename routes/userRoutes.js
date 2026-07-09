const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'خطا در خروج از حساب.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'با موفقیت خارج شدید.' });
    });
});

module.exports = router;