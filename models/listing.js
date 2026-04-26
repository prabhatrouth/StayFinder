const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  image: {
    url: String,
    filename: String
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  location: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  // 🔥 ADD THIS (FIX ERROR)
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],

  geometry: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: [Number]
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });


// SEARCH INDEX
listingSchema.index({
  title: "text",
  location: "text",
  country: "text"
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;