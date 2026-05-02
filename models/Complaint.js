const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  lab: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);