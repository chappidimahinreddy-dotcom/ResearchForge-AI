const express = require('express');

const router = express.Router();

const { authenticateToken } = require('../middleware/auth');
const exploreController = require('../controllers/exploreController');

// All Explore endpoints require authentication
router.use(authenticateToken);

// Generate research exploration
router.post('/', exploreController.generate);

module.exports = router;