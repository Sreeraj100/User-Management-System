const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserByAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id', protect, admin, updateUserByAdmin);

module.exports = router;
