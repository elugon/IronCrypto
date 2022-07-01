const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();



router.get('/', isLoggedIn, async (req, res, next) => {  
    const userFromCookie = req.session.currentUser;   
    try {
        const user = await User.findById(userFromCookie._id);
        const data = await CoinGeckoClient.coins.all(); 
        // const retrievePriceUsd = data;
        // res.json({ data, user });
        res.render('select-favorites',data);        
    } catch (error) {
        next(error)
    }
  });

router.post('/', isLoggedIn, async (req,res,next)=>{
    const { cryptoCoins } =req.body;
    try {
    console.log(cryptoCoins)
    } catch (error) {
        
    }
   
})

module.exports = router;