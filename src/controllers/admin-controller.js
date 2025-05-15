const Job = require("../models/Job-model");
const User = require("../models/User-model");
const { validateJobPosting } = require("../utils/validation");
const { authMiddleware, authorize } = require("../middleware/auth-middleware");

// Get all Users ( admin only )
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    if (!users) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }

    res.status(200).json({
      success: true,
      message: "users found successfully",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get all jobs ( admin only )
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(400).json({
        success: false,
        message: "Jobs not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Update the user role ( admin only )
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "recruiter", "seeker"].includes(role)) {
      return res.status(404).json({
        success: false,
        message: "Invalid role type",
      });
    }

    const userID = req.params.id;
    const currentUser = await User.findById(userID);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found on this ID",
      });
    }

    currentUser.role = role;
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

// Delete the user ( admin only )
const deleteUser = async (req, res) => {
  try {
    // userID obtain from url
    const userID = req.params.id;

    // based on userID, we get the that user details
    const currentUserToBeDelete = await User.findById(userID);

    // checking either the currentUserToBeDelete is found or not
    if (!currentUserToBeDelete) {
      return res.status(404).json({
        success: false,
        message: "User with this ID not found",
      });
    }

    // Delete all jobs posted by the user
    await Job.deleteMany({ postedBy: currentUserToBeDelete._id });

    // remove the user from the database
    await User.findByIdAndDelete(userID);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



module.exports = { getAllUsers, getAllJobs, updateUserRole, deleteUser };
