import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    // Only allow 'author' self-assignment; 'admin' can never be self-assigned at signup
    const safeRole = role === "author" ? "author" : "reader";

    const user = await User.create({ name, email, password, role: safeRole });
    const token = generateToken(user._id, user.role);

    res.cookie("token", token, cookieOptions());
    res.status(201).json({ success: true, token, user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);
    res.cookie("token", token, cookieOptions());
    res.status(200).json({ success: true, token, user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout (clears cookie)
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions());
  res.status(200).json({ success: true, message: "Logged out" });
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
};

// @desc    Update current user's profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    if (name !== undefined) req.user.name = name;
    if (bio !== undefined) req.user.bio = bio;
    await req.user.save();
    res.status(200).json({ success: true, user: req.user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};
