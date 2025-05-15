const Job = require("../models/Job-model");
const User = require("../models/User-model");
const Application = require("../models/Application-model");
const { validateJobPosting, validateApplyingOnJob } = require("../utils/validation");
const { uploadToCloudinary } = require('../helper/cloudinaryHelper'); // Fixed import
const fs = require("fs");
const path = require("path");

// Apply for job (only seeker)
const applicationForJobApply = async (req, res) => {
  try {
    const { error } = validateApplyingOnJob(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required"
      });
    }

    const job = await Job.findById(req.body.job);
    if (!job) {
      // Clean up uploaded file if job not found
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: req.body.job,
      applicant: req.user._id
    });

    if (existingApplication) {
      // Clean up uploaded file if already applied
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.path);
    
    const application = new Application({
      job: req.body.job,
      applicant: req.user._id,
      resume: cloudinaryResult.url,
      url: cloudinaryResult.url,
      publicId: cloudinaryResult.publicId
    });

    await application.save();

    // Add application to job's applications array
    job.applications.push(application._id);
    await job.save();

    // Clean up the temporary file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (err) {
    console.error(err);
    // Clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong while applying for job",
      error: err.message
    });
  }
};

module.exports = { applicationForJobApply };