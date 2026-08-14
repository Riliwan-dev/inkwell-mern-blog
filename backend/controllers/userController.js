import User from "../models/User.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users.map((u) => u.toSafeObject()) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's role
// @route   PUT /api/users/:id/role
// @access  Private (admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["admin", "author", "reader"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, data: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account here" });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
