const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();
const isLoggedIn = require('../middlewares');


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

router.get('/edit-profile/:userId', isLoggedIn, async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        res.render('auth/edit-profile', user);
    } catch (error) {
        next(error)
    }
  });

router.post('/edit-profile/:userId', isLoggedIn, async (req, res, next) => {
    const { userId } = req.params;
    const {username, email} = req.body;
    if (!username || !email) {
        res.render("auth/edit-profile", {
          error: "All fields are mandatory. Please fill them before submitting.",
        });
        return;
    }    
    try {
        const updateUser = await User.findByIdAndUpdate(userId, {username, email}, {new: true});
        req.session.currentUser = updateUser;
        res.redirect(`/profile`)
    } catch (error) {
        next(error)
        
    }
  });

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