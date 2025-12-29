const User = require('../models/User');

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.file) {
            user.profileImage = req.file.path;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    getMe,
    updateProfile,
};
