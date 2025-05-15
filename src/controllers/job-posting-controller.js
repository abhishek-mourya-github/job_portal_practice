const Job = require("../models/Job-model");
const { validateJobPosting } = require("../utils/validation");

// Create Job ( only by recruiter )
const jobPosting = async (req, res) => {
  try {
    // Validate input using JOI
    const { error } = validateJobPosting(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      title,
      description,
      location,
      company,
      salary,
      jobType,
      skillsRequired,
    } = req.body;

    // Generate unique ID
    const uniqueIdentifier = `${title}-${company}-${location}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    // Check for duplicates
    if (await Job.findOne({ uniqueIdentifier })) {
      return res.status(400).json({
        success: false,
        message: "Duplicate job detected",
      });
    }

    // Create and save job
    const job = new Job({
      title,
      description,
      location,
      company,
      salary: salary || "Negotiable",
      jobType: jobType || "Full-time",
      skillsRequired,
      uniqueIdentifier,
      createdBy: req.user._id,
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (err) {
    console.error("Job Posting Error:", {
      error: err.message,
      stack: err.stack,
      body: req.body,
    });

    // Handle duplicate key errors separately
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Job with these details already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Job posting failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get all jobs ( only by recruiter )
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 }); // this line help to shows the newest job first
    res.status(200).json({
      success: true,
      message: "Successfully fetched all the data",
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
    });
  }
};

// Get jobs by ID
const getJobByID = async (req, res) => {
  try {
    const job = await Job.findById(req?.params?.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job on following ID is not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      getJobByID,
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while selecting job by ID",
    });
  }
};

// Search job by filter like title, location, jobType, etc.
const filterJob = async (req, res) => {
  try {
    const { title, company, location, jobType } = req.query;

    const query = {};

    if (title) {
      query.title = { $regex: new RegExp(title, "i") }; // case-insensitive
    }
    if (company) {
      query.company = { $regex: new RegExp(company, "i") };
    }
    if (location) {
      query.location = { $regex: new RegExp(location, "i") };
    }
    if (jobType) {
      query.jobType = { $regex: new RegExp(jobType, "i") };
    }

    const jobAccording = await Job.find(query);

    if (jobAccording.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job with this filter not available",
      });
    }

    res.status(200).json({
      success: true,
      data: jobAccording,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while filtering job",
    });
  }
};

// Delete the job ( by only recruiter or admin )
const deleteJobByID = async (req, res) => {
  try {
    const jobId = req.params.id;

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job with this ID not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      deletedJob,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the job by ID",
    });
  }
};

module.exports = {
  jobPosting,
  getAllJobs,
  getJobByID,
  filterJob,
  deleteJobByID,
};
