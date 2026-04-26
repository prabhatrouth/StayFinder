const User = require("../models/user");


// ================= SIGNUP FORM =================
module.exports.renderSignup = (req, res) => {
  res.render("users/signup");
};


// ================= SIGNUP (🔥 FINAL FIX) =================
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // ✅ validation
    if (!username || !email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/signup");
    }

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/signup");
    }

    // ✅ create user
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    // ✅ login user
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to StayFinder!");

      // 🔥 CRITICAL FIX (without this redirect fails)
      req.session.save((err) => {
        if (err) return next(err);
        return res.redirect("/listings");
      });
    });

  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
};


// ================= LOGIN FORM =================
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};


// ================= LOGIN =================
module.exports.login = (req, res) => {

  req.flash("success", "Welcome back!");

  let redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl;

  // 🔥 IMPORTANT
  req.session.save(() => {
    res.redirect(redirectUrl);
  });
};


// ================= LOGOUT =================
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.flash("success", "Logged out!");
    res.redirect("/listings");
  });
};