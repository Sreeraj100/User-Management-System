const User = require('../models/User');


const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
};


const updateProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        if (req.body.name && req.body.name.trim() !== '') {
            user.name = req.body.name;
        }
        if (req.body.email && req.body.email.trim() !== '') {
            user.email = req.body.email;
        }

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
