const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares');
const User = require('../models/User');
const fileUploader = require('../config/cloudinary.config');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})
// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get('/login', (req, res, next) => {
  res.render('auth/login');
})
// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post('/signup', async (req, res, next) => {
  const { email, password,passwordConfirmation, username} = req.body;
  // Check if user introduced all values
  if (!email || !password || !passwordConfirmation || !username) {
    res.render("auth/signup", {
      error: "All fields are mandatory. Please fill them before submitting.",
    });
    return;
  }
  // Check if password meets requirements
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)||!regex.test(passwordConfirmation)) {
    res.render("auth/signup", {
      error:
        "Password must have 6 or more characters, a lowercase letter, a uppercase letter and at least one number.",
    });
    return;
    }
    // Check if password and passwordConfirmation are equal
  if (password!==passwordConfirmation) {
    res.render("auth/signup", {
      error:
        "Password and password confirmation are NOT equal",
    });
    return;
  }
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({username, email, hashedPassword});
    res.render('auth/login', user)
  } catch (error) {
    next(error)
  }
});
// @desc    Sends user auth data to database to authenticate user
// @route   POST /auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    if (!password || !email) {
      res.render("auth/login", {
        error: "All fields are mandatory. Please fill them before submitting.",
      });
      return;
    }
    // Remember to assign user to session cookie:
    const user = await User.findOne({ email: email });
    if (!user) {
      res.render('auth/login', { error: "User not found" });
      return;
    } else {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        req.session.currentUser = user;
        res.redirect('/profile');
      } else {
        res.render('auth/login', { error: "Unable to authenticate user" });
      }
    }
  } catch (error) {
    next(error);
  }
})
// @desc    Destroy user session and log out
// @route   POST /auth/logout
// @access  Private
router.post('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect('/auth/login');
    }
  });
})
module.exports = router;
