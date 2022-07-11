const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();


// @desc    Display all of the available coins
// @route   GET /all-coins
// @access  Private
router.get('/', isLoggedIn, async (req, res, next) => {  
    const userFromCookie = req.session.currentUser;   
    try {
        const user = await User.findById(userFromCookie._id);
        const data = await CoinGeckoClient.coins.all(); 
        res.render('all-coins',{user,data} );        
    } catch (error) {
        next(error)
    }
  });

module.exports = router;