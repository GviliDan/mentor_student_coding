// controllers/codeBlockController.js
const CodeBlock = require('../models/CodeBlock');

exports.getAllCodeBlocks = async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find();
    res.json(codeBlocks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCodeBlockById = async (req, res) => {
  const id = req.params.id;
  try {
    const codeBlock = await CodeBlock.findById(id)
    if (!codeBlock) {
      return res.status(404).json({ message: 'Code block not found' });
    }
    res.json(codeBlock);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.saveCodeBlock = async (req, res) => {
  const id = req.params.id;
  const { code } = req.body;

  try {
    const codeBlock = await CodeBlock.findOneAndUpdate(
      { _id: id },
      { $set: { code } },
      { new: false }
    );

    if (!codeBlock) {
      return res.status(404).json({ message: 'Code block not found' });
    }

    res.json(codeBlock);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
