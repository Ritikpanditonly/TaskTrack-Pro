const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate token
const generateToken = (_id) => {
  return jwt.sign({ id:_id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


// @Signup
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create user
    const user = await User.create({ name, email, password });

    // Return token
    console.log(user);

    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Incoming login:", email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("🔍 Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    //console.log(token);
    return res.
  cookie("token", token, {
    httpOnly: true, // Secure from JS
    secure: process.env.NODE_ENV === "production", // send cookie over HTTPS only in prod
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }).status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("💥 Login error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
