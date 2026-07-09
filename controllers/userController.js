const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'لطفاً تمامی فیلدها را پر کنید.' });
        }

        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'این ایمیل قبلاً ثبت شده است.' });
        }

        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'این نام کاربری قبلاً انتخاب شده است.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create(username, email, hashedPassword);

        res.status(201).json({ message: 'ثبت‌نام با موفقیت انجام شد.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطایی در سرور رخ داده است.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'لطفاً ایمیل و رمز عبور را وارد کنید.' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'اطلاعات ورود صحیح نیست.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'اطلاعات ورود صحیح نیست.' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;

        res.status(200).json({ message: 'ورود با موفقیت انجام شد.', username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'خطایی در سرور رخ داده است.' });
    }
};