const express = require('express');
const router = express.Router();
const codeBlockController = require('../controllers/codeBlockController');

// GET all code blocks
router.get('/', codeBlockController.getAllCodeBlocks);

// GET a code block by id
router.get('/:id', codeBlockController.getCodeBlockById);

// POST a code block by id (for code submission)
router.post('/:id', codeBlockController.saveCodeBlock);

module.exports = router;
