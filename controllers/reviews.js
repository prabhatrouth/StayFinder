const Listing = require("../models/listing");
const Review = require("../models/review");


// ================= CREATE REVIEW =================
module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const review = new Review(req.body.review);

  // 🔥 link review with user
  review.author = req.user._id;

  // 🔥 push into listing
  listing.reviews.push(review);

  await review.save();
  await listing.save();

  req.flash("success", "Review added successfully");

  res.redirect(`/listings/${listing._id}`);
};


// ================= DELETE REVIEW =================
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // 🔥 remove review reference from listing
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  // 🔥 delete review from DB
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted");

  res.redirect(`/listings/${id}`);
};