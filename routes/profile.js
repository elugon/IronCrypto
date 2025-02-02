const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();
const isLoggedIn = require('../middlewares');
const fileUploader = require('../config/cloudinary.config');
// @desc    Display the logged user profile
// @route   GET /profile
// @access  Private
router.get('/',isLoggedIn, async (req, res, next) => {
    const user = req.session.currentUser;    
    try {
      const data = await Promise.all(user.favorites.map(async elem=>{return CoinGeckoClient.coins.fetch(elem, {tickers:false, community_data:false, developer_data:false, localization:false, sparkline:true})}));
      const userFromDB = await User.findById(user._id);
      res.render('auth/profile', {userFromDB,data});
    } catch (error) {
        next(error)
    }    
  });
// @desc    Display a form to edit the user profile
// @route   GET /profile/edit-profile/:userId
// @access  Private
router.get('/edit-profile/:userId', isLoggedIn, async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        res.render('auth/edit-profile', user);
    } catch (error) {
        next(error)
    }
  });
// @desc    Sends the edited data to the database
// @route   POST /profile/edit-profile/:userId
// @access  Private
 router.post('/edit-profile/:userId', isLoggedIn, fileUploader.single('imageUrl'), async (req, res, next) => {
    const { userId } = req.params;
    const {username, email} = req.body;
    if (!username || !email) {
        res.render("auth/edit-profile", {
          error: "All fields are mandatory. Please fill them before submitting.",
        });
        return;
    }    
    try {
        const updateUser = await User.findByIdAndUpdate(userId, {username, email, imageUrl: req.file.path}, {new: true});
        req.session.currentUser = updateUser;
        res.redirect(`/profile`)
    } catch (error) {
        next(error)
        
    }
  });
// @desc    Deletes logged user
// @route   POST /profile/delete/:userId
// @access  Private
  router.post('/delete/:userId',isLoggedIn, async (req, res, next) => {
    const { userId } = req.params;
    try {
      // Deletes from DB
      await User.findByIdAndDelete(userId);
      // Deletes from cookie
      req.session.destroy((err) => {
        if (err) {
          next(err)
        } else {
          res.redirect('/auth/login');
        }
    });
    } catch (error) {
      next(error);
    }
  })
module.exports = router;