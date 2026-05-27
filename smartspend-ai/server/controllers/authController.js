const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const makeToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
};

const sendUser = (res, user) => {
  res.json({
    token: makeToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      monthlyBudget: user.monthlyBudget,
      currency: user.currency,
      preferences: user.preferences
    }
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const alreadyExists = await User.findOne({ email: email.toLowerCase() });
    if (alreadyExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });
    sendUser(res, user);
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendUser(res, user);
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
  const allowed = ["name", "monthlyBudget", "currency", "preferences"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });

  const saved = await req.user.save();
  res.json({
    user: {
      id: saved._id,
      name: saved.name,
      email: saved.email,
      monthlyBudget: saved.monthlyBudget,
      currency: saved.currency,
      preferences: saved.preferences
    }
  });
};
