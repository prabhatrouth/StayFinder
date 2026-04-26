const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  // 🔐 AUTHOR
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });   // 🔥 THIS LINE IS THE FIX

module.exports = mongoose.model("Review", reviewSchema);