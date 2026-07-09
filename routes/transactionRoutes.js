const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authGuard = require('../middleware/authMiddleware');

router.use(authGuard);

router.delete('/:id', transactionController.deleteTransaction);
router.post('/', transactionController.addTransaction);
router.get('/', transactionController.getTransactions);
router.get('/summary', transactionController.getFinanceSummary);

module.exports = router;