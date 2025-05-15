const { required } = require("joi");
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  url: {
  type : String,
  required : true,
  },
  publicId : {
    type : String,
    required : true
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "shortlisted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
applicationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
