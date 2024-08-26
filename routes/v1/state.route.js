const express = require('express');
const router = express.Router();
const stateController = require('../../controllers/state.controller');

// Create a new state
router.post('/', stateController.createState);

// Get all states
router.get('/', stateController.getAllStates);

// Get a state by ID
router.get('/:id', stateController.getStateById);

// Update a state by ID
router.put('/:id', stateController.updateState);

// Delete a state by ID
router.delete('/:id', stateController.deleteState);

module.exports = router;
