const Listing = require("../models/listing");
const expressError = require("../utils/expressError");
const cloudinary = require("../cloudConfig");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapToken });


// ================= INDEX =================
module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } }
    ];
  }

  const alllisting = await Listing.find(filter);

  const categories = [
    "Hotel", "Villa", "Resort", "Apartment", "Cottage"
  ];

  res.render("listings/index", {
    alllisting,
    category,
    search,
    categories
  });
};


// ================= NEW =================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};


// ================= MY LISTINGS =================
module.exports.myListings = async (req, res) => {
  const myListings = await Listing.find({
    owner: req.user._id
  });

  res.render("listings/my", { myListings });
};


// ================= CREATE =================
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // LOCATION
  if (req.body.listing.lat && req.body.listing.lng) {
    newListing.geometry = {
      type: "Point",
      coordinates: [
        parseFloat(req.body.listing.lng),
        parseFloat(req.body.listing.lat)
      ]
    };
  } else {
    const geoData = await geocoder.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    }).send();

    if (!geoData.body.features.length) {
      req.flash("error", "Invalid location");
      return res.redirect("/listings/new");
    }

    newListing.geometry = geoData.body.features[0].geometry;
  }

  // IMAGE UPLOAD (🔥 FIXED)
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);

    newListing.image = {
      url: result.secure_url,
      filename: result.public_id
    };
  }

  await newListing.save();

  req.flash("success", "Listing Created");
  res.redirect("/listings");
};


// ================= SHOW =================
module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new expressError(400, "Invalid ID"));
    }

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" }
      })
      .populate("owner");

    if (!listing) {
      return next(new expressError(404, "Listing Not Found"));
    }

    if (!listing.reviews) {
      listing.reviews = [];
    }

    res.render("listings/show", { listing });

  } catch (err) {
    next(err);
  }
};


// ================= EDIT =================
module.exports.renderEditForm = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new expressError(404, "Listing Not Found"));
  }

  res.render("listings/edit", { listing });
};


// ================= UPDATE =================
module.exports.updateListing = async (req, res) => {
  let listing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body.listing,
    { new: true }
  );

  if (req.file) {
    // OPTIONAL: delete old image from Cloudinary
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    listing.image = {
      url: result.secure_url,
      filename: result.public_id
    };

    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${req.params.id}`);
};


// ================= DELETE =================
module.exports.deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  // OPTIONAL: delete image from Cloudinary
  if (listing && listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  await Listing.findByIdAndDelete(req.params.id);

  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};