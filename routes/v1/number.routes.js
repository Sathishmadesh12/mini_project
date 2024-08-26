const express = require('express');
const router = express.Router();
const numberController = require('../../controllers/number.controller');

// Define routes
router.post('/', numberController.createNumber);
router.get('/', numberController.getAllNumbers);
router.get('/:id', numberController.getNumberById);
router.put('/:id', numberController.updateNumber);
router.delete('/:id', numberController.deleteNumber);

module.exports = router;
