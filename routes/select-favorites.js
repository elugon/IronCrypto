const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();
const isLoggedIn = require('../middlewares');



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
    const userFromCookie = req.session.currentUser;
    try {
    
    let clearFavorites=await User.findByIdAndUpdate(userFromCookie._id,
        {"favorites": []},
        {new : true,
        upsert: true});

    let updateFavorites= await User.findByIdAndUpdate(userFromCookie._id,
        {$push: {"favorites": cryptoCoins}},
        {new : true,
        upsert: true});
        res.redirect('/coins-to-see');
    
    } catch (error) {
        next(error)
    }
   
})

module.exports = router;