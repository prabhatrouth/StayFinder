const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const { listingSchema } = require("../schema");

const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controllers/listings");

// 🔥 MULTER (UPDATED)
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// ================= VALIDATION =================
const validateListing = (req, res, next) => {
  if (!req.body.listing) {
    req.body.listing = {};
  }

  const { error } = listingSchema.validate(req.body);

  if (error) {
    return next(new expressError(400, error.details[0].message));
  }

  next();
};

// ================= ROUTES =================

// INDEX
router.get("/", wrapAsync(listingController.index));

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// MY LISTINGS
router.get("/my", isLoggedIn, wrapAsync(listingController.myListings));

// CREATE
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// SHOW
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;