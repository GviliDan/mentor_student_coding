// routes/codeblocks.js
const express = require('express');
const router = express.Router();
const CodeBlock = require('../models/CodeBlock');

// GET all code blocks
router.get('/', async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find();
    res.json(codeBlocks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a code block by title
router.get('/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const codeBlock = await CodeBlock.findOne({ title });
    if (!codeBlock) {
      return res.status(404).json({ message: 'Code block not found' });
    }
    res.json(codeBlock);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
