if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

// ROUTES
const userRouter = require("./routes/user");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");

const expressError = require("./utils/expressError");


// ================= DB =================
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));


// ================= VIEW ENGINE =================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());


// ================= SESSION =================
app.use(session({
  secret: process.env.SESSION_SECRET || "mysupersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use(flash());


// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ================= GLOBAL VARIABLES (🔥 FIX HERE) =================
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  // 🔥 THIS WAS MISSING (MAIN BUG)
  res.locals.mapToken = process.env.MAP_TOKEN;

  next();
});


// ================= ROUTES =================
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// ================= HOME =================
app.get("/", (req, res) => {
  res.redirect("/listings");
});


// ================= ERROR =================
app.use((req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});


// ================= SERVER =================
app.listen(8080, () => {
  console.log("Server running on port 8080");
});