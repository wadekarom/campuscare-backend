const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Complaint = require("./models/Complaint");

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 DEBUG: check if env is coming
console.log("MONGO_URI:", process.env.MONGO_URI);

// 🔌 Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB ERROR:", err));

// Routes
app.get("/", (req, res) => {
  res.send("CampusCare backend running 🚀");
});

app.post("/api/v1/complaints", async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();

    res.json({
      message: "Complaint saved successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/v1/complaints/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
