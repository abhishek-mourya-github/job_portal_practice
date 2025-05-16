const Application = require("../models/Application-model");
const uploadToCloudinary  = require("../helper/cloudinaryHelper");
const fs = require('fs');

const applicationForJobApply = async (req, res) => {
  try {
    const { job } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF required" });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path);
    if (!result) throw new Error("Cloudinary upload failed");

    const application = new Application({
      job,
      applicant: req.user.id,
      resume: result.url,
      url: result.url,
      publicId: result.publicId,
      status: "pending"
    });

    await application.save();
    fs.unlinkSync(req.file.path); // Delete local file

    res.status(201).json({
      success: true,
      application
    });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path); // Cleanup on error
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { applicationForJobApply };