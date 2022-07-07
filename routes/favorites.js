const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();
const isLoggedIn = require('../middlewares');

router.get('/', isLoggedIn, async (req, res, next) => {  
      
    try {
        const user = req.session.currentUser; 
        //const user = await User.findById(userFromCookie._id);
        const data = await Promise.all(user.favorites.map(async elem=>{return CoinGeckoClient.coins.fetch(elem, {tickers:false, community_data:false, developer_data:false, localization:false, sparkline:true})}));
        res.render('favorites',{data});        
    } catch (error) {
        next(error)
    }
  });

module.exports = router;