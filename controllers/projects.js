// Package dependencies
const auth = require('../middleware/auth');
const express = require('express');
const Project = require('../models/project');

// Router configuration
const router = express.Router();

// Routes
router.get('/', auth, async (req, res) => {
  const { userID } = req.body;
  const projects = await Project.find({ userID }).catch((err) =>
    res.status(400).json({ error: err.message })
  );
  res.status(200).json(projects);
});

router.post('/', auth, async (req, res) => {
  try {
    // Destructure the body
    const { userID, name, key } = req.body;

    // Validation: check if name already exists
    const projWithSameName = await Project.findOne({ userID, name });

    if (projWithSameName) {
      return res
        .status(400)
        .json({ error: 'A project with that name already exists' });
    }

    // Validation: check if key already exists
    const projWithSameKey = await Project.findOne({ userID, key });

    if (projWithSameKey) {
      return res.status(400).json({
        error: `Project '${projWithSameKey.name}' uses this project key.`,
      });
    }

    // If all validation passes, create and return new project as JSON
    const newProject = await Project.create({ userID, name, key });
    return res.status(200).json(newProject);
  } catch (error) {
    return res.status(400).json({ error: err.message });
  }
});

// Export router
module.exports = router;
