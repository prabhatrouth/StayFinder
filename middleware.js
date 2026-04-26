const Listing = require("./models/listing");
const Review = require("./models/review");


// ================= SAVE REDIRECT URL =================
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


// ================= LOGIN CHECK (🔥 FIXED) =================
module.exports.isLoggedIn = (req, res, next) => {

  if (!req.isAuthenticated()) {

    // 🔥 SAVE ORIGINAL URL
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "Please login first!");
    return res.redirect("/login");
  }

  next();
};


// ================= LISTING OWNER =================
module.exports.isOwner = async (req, res, next) => {

  const listing = await Listing.findById(req.params.id);

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner!");
    return res.redirect(`/listings/${req.params.id}`);
  }

  next();
};


// ================= REVIEW AUTHOR =================
module.exports.isReviewAuthor = async (req, res, next) => {

  const review = await Review.findById(req.params.reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the review author!");
    return res.redirect(`/listings/${req.params.id}`);
  }

  next();
};