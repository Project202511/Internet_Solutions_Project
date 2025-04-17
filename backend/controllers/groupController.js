const Group = require('../models/Group');  /*  Group and user model-interact with MongoDB*/
const User = require('../models/User');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = await Group.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id], // Owner is automatically a member--
    });

    // Update user's groups array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { groups: group._id } }
    );

    // Populate the owner info before returning
    const populatedGroup = await Group.findById(group._id).populate('owner', 'name email');

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all groups the user belongs to
// @route   GET /api/groups
// @access  Private
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    }).populate('owner', 'name email');

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private
const getGroupById = async (req, res) => {
  try {
    /*Find the group by its ID, populating both owner and members */
    const group = await Group.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is a member of the group
    if (!group.members.some(member => member._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this group' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a group
// @route   PUT /api/groups/:id
// @access  Private
const updateGroup = async (req, res) => {          /*find the group by its id  */
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is the owner of the group
    if (group.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this group' });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name || group.name,
        description: req.body.description || group.description,
      },
      { new: true, runValidators: true }
    ).populate('owner', 'name email').populate('members', 'name email');

    res.json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a group
// @route   DELETE /api/groups/:id
// @access  Private
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is the owner of the group
    if (group.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this group' });  /*Return error if user is not the owner */
    }

    // Remove group from all member users' groups arrays
    await User.updateMany(
      { _id: { $in: group.members } },
      { $pull: { groups: group._id } }
    );

    await group.deleteOne();//delete the group
    res.json({ message: 'Group removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a member to a group
// @route   POST /api/groups/:id/members
// @access  Private
const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is the owner of the group
    if (group.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add members to this group' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member
    if (group.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a member of this group' });
    }

    // Add user to group members
    group.members.push(user._id);
    await group.save();

    // Add group to user's groups
    await User.findByIdAndUpdate(
      user._id,
      { $push: { groups: group._id } }
    );

    // Return updated group with populated members
    const updatedGroup = await Group.findById(group._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove a member from a group
// @route   DELETE /api/groups/:id/members/:userId
// @access  Private
const removeMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is the owner of the group
    if (group.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to remove members from this group' });
    }

    // Cannot remove the owner
    if (req.params.userId === group.owner.toString()) {
      return res.status(400).json({ message: 'Cannot remove the group owner' });
    }

    // Remove user from group members
    group.members = group.members.filter(
      member => member.toString() !== req.params.userId
    );
    
    await group.save();

    // Remove group from user's groups
    await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { groups: group._id } }
    );

    // Return updated group with populated members
    const updatedGroup = await Group.findById(group._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
};