const express = require('express');
const router = express.Router();
const {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createGroup)
  .get(protect, getGroups);

router.route('/:id')
  .get(protect, getGroupById)
  .put(protect, updateGroup)
  .delete(protect, deleteGroup);

router.route('/:id/members')
  .post(protect, addMember);

router.route('/:id/members/:userId')
  .delete(protect, removeMember);

module.exports = router;