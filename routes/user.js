const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware");


// ================= SIGNUP =================
router
  .route("/signup")
  .get(userController.renderSignup)
  .post(userController.signup);


// ================= LOGIN =================
router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl, // 🔥 IMPORTANT (for redirect after login)
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );


// ================= LOGOUT =================
router.get("/logout", userController.logout);


module.exports = router;