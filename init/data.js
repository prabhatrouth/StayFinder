const mongoose = require("mongoose");

const categories = ["Hotel", "Villa", "Resort", "Apartment", "Cottage"];

const locations = [
  { city: "Goa", country: "India", coords: [73.8567, 15.2993] },
  { city: "Mumbai", country: "India", coords: [72.8777, 19.0760] },
  { city: "Delhi", country: "India", coords: [77.1025, 28.7041] },
  { city: "Manali", country: "India", coords: [77.1887, 32.2432] },
  { city: "Jaipur", country: "India", coords: [75.7873, 26.9124] },
  { city: "Bangalore", country: "India", coords: [77.5946, 12.9716] },
  { city: "Udaipur", country: "India", coords: [73.7125, 24.5854] },
  { city: "Bali", country: "Indonesia", coords: [115.1889, -8.4095] },
  { city: "Dubai", country: "UAE", coords: [55.2708, 25.2048] },
  { city: "Maldives", country: "Maldives", coords: [73.2207, 3.2028] }
];

// 🔥 Reliable images (no broken links)
const images = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  "https://images.unsplash.com/photo-1501117716987-c8e1ecb2102c",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
];

const sampleListings = Array.from({ length: 200 }, (_, i) => {
  const loc = locations[i % locations.length];
  const category = categories[i % categories.length];
  const img = images[i % images.length];

  return {
    title: `${category} Stay ${i + 1}`,
    description: "Beautiful stay with modern facilities and comfort.",

    image: {
      url: `${img}?auto=format&fit=crop&w=800&q=60`,
      filename: "demo"
    },

    price: Math.floor(Math.random() * 4000) + 2000,

    location: loc.city,
    country: loc.country,
    category: category,

    reviews: [],

    geometry: {
      type: "Point",
      coordinates: loc.coords
    },

    // 🔥 Replace with real user ID later if needed
    owner: new mongoose.Types.ObjectId("69ed27c8b4ba7dc22b577582")
  };
});

module.exports = { data: sampleListings };