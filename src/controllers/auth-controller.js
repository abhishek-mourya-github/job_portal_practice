const User = require("../models/User-model");
const bcrypt = require("bcryptjs");
const { validateRegistration, validateLogin } = require("../utils/validation");
const jwt = require("jsonwebtoken");

// Register the User
const registerUser = async (req, res) => {
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { username, email, password, role } = req.body;
    const userExists = await User.exists({ $or: [{ username }, { email }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = new User({
      username,
      email,
      password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
      role: role || "seeker",
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered",
      data: user,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login the User
const loginUser = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Credentials required",
      });
    }

    // user will get that user data while performing findOne
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }


    // that user data we are using here to generate the accessToken
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { registerUser, loginUser };