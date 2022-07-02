const router = require("express").Router();
const User = require('../models/User');

router.get('/', isLoggedIn, async (req, res, next) => {  
      
    try {
    const userFromCookie = await req.session.currentUser; 
    res.render('coins-to-see',userFromCookie);        
    } catch (error) {
        next(error)
    }
  });

module.exports = router;