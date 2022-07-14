const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();
const isLoggedIn = require('../middlewares');
const { update } = require("../models/User");
// @desc    Displays a list of all available coins and a checkbox for each one to select favorites
// @route   GET /select-favorites
// @access  Private
router.get('/', isLoggedIn, async (req, res, next) => {  
    try {
        const data = await CoinGeckoClient.coins.all(); 
        res.render('select-favorites', { data });        
    } catch (error) {
        next(error)
    }
  });
// @desc    Sends the selected coins to the data base and assigns them to the user
// @route   POST /select-favorites
// @access  Private
router.post('/', isLoggedIn, async (req,res,next)=>{
    const userFromCookie = req.session.currentUser;
    try {
        const { cryptoCoins } =req.body;
        if (!cryptoCoins) {
            const data = await CoinGeckoClient.coins.all(); 
            res.render("select-favorites", {data, error: "Please select your favorite coins."});
            return
             }
        if (cryptoCoins.length > 6) {
            const data = await CoinGeckoClient.coins.all(); 
            res.render("select-favorites", {data, error: "You can only choose up to 6 favorite coins."});
            return
        }
    await User.findByIdAndUpdate(userFromCookie._id,
        {"favorites": []},
        {new : true,
        upsert: true});
    let updatedUser = await User.findByIdAndUpdate(userFromCookie._id,
        {$push: {"favorites": cryptoCoins}},
        {new : true,
            upsert: true
        });
        req.session.currentUser = updatedUser;
        res.redirect('/favorites');
    } catch (error) {
        next(error)
    }
})
module.exports = router;