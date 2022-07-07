const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();
const isLoggedIn = require('../middlewares');
const { update } = require("../models/User");



router.get('/', isLoggedIn, async (req, res, next) => {  
    const userFromCookie = req.session.currentUser;   
    try {
        const user = await User.findById(userFromCookie._id);
        const data = await CoinGeckoClient.coins.all(); 
         res.render('select-favorites',data);        
    } catch (error) {
        next(error)
    }
  });

router.post('/', isLoggedIn, async (req,res,next)=>{
    const { cryptoCoins } =req.body;
    const userFromCookie = req.session.currentUser;
    try {
    
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