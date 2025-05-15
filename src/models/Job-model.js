const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: 
    { 
        type: String, 
        required: true, 
        index: true 
    },
    location: 
    { 
        type: String, 
        required: true, 
        index: true 
    },
    salary: 
    { 
        type: String, 
        default: "Negotiable" 
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    skillsRequired: 
    { 
        type: [String], 
        required: true 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    uniqueIdentifier: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
    statics: {
      findByCompany: async function (company) {
        return this.find({ company }).lean();
      },
    },
  }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
