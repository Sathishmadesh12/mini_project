const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user1.controller'); // Adjust path as needed

router.post('/', userController.signUp);

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;
