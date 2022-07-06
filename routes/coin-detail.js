const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();

router.get('/:coin', isLoggedIn, async (req, res, next) => {  
    const userFromCookie = req.session.currentUser;
    const {coin} = req.params
           
    try {
        const user = await User.findById(userFromCookie._id);
        const data = await CoinGeckoClient.coins.fetch(`${coin}`, {tickers:false, community_data:false, developer_data:false, localization:false, sparkline:true}); 
        res.render('coin-detail',{user,data} );        
    } catch (error) {
        next(error)
    }
  });


module.exports = router;