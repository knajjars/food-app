const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { name, password, email } = req.body;
  if (name === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate all the fields" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      name,
      password: hashPass,
      email
    })
      .then(user => {
        req.login(user, function(err) {
          if (err) {
            return res.redirect("/auth/signup");
          }
          return res.redirect("/auth/preferences");
        });
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/preferences", (req, res) => {
  res.render("auth/preferences");
});

router.post("/preferences", (req, res) => {
  const { preferedCuisines } = req.body;
  console.log(preferedCuisines);
  User.findByIdAndUpdate(req.user._id, {
    preferedCuisines: preferedCuisines
  }).then(user => {
    res.redirect("/");
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
