const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', projectController.create);
router.get('/', projectController.list);
router.get('/:id', projectController.getById);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);

module.exports = router;

