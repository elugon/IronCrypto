const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const Comment = require('../models/Comment')
const fileUploader = require('../config/cloudinary.config');
const CoinGeckoClient = new CoinGecko();
// @desc    Displays de comment section of the coin required.
// @route   GET /comments/"coin name"
// @access  Private
router.get('/:coin', isLoggedIn, async (req, res, next) => {  
    const userFromCookie = req.session.currentUser; 
    const {coin} = req.params
       try {
        const user = await User.findById(userFromCookie._id);
        const data = await CoinGeckoClient.coins.fetch(`${coin}`, {tickers:false, community_data:false, developer_data:false, localization:false, sparkline:true});
        const userComment = await Comment.find({ coinComment: coin });
        res.render('comment-section',{user,data,userComment});        
    } catch (error) {
        next(error)
    }
  });
  // @desc    Sends the comment in the form to the data base
  // @route   POST /comments/"coin name"
  // @access  Private  
  router.post('/:coin', async (req, res, next) => {
    const { comment, coinComment, commentingUser, userImage } = req.body;
    const userFromCookie = req.session.currentUser;
    const {coin} = req.params  
    const data = await CoinGeckoClient.coins.fetch(`${coin}`, {tickers:false, community_data:false, developer_data:false, localization:false, sparkline:true});   
    if (!comment) {
      res.redirect(`/comments/${coin}`);
      return;
    }
    try {
      const userComment = await Comment.create({comment, coinComment, commentingUser, userImage});
      const user = await User.findById(userFromCookie._id); 
      res.redirect(`/comments/${coin}`)
    } catch (error) {
      next(error)
    }
  });
module.exports = router;