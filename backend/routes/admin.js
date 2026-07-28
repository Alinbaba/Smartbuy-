const express = require('express');
const { getDashboard, createSubAdmin } = require('../controllers/adminController');
const router = express.Router();

router.get('/dashboard', getDashboard);
router.post('/subadmin', createSubAdmin);

module.exports = router;