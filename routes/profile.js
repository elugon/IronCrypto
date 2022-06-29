const router = require("express").Router();
const User = require('../models/User');


router.get('/:userId',isLoggedIn, async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        res.render('auth/profile', {user});

    } catch (error) {
        next(error)
        
    }    
  });

  router.get ('/edit-profile/:userId', isLoggedIn, async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        res.render('auth/edit-profile', {user});
    } catch (error) {
        next(error)
        
    }

  });

  router.post ('/edit-profile/:userId', async (req, res, next) => {
    const { userId } = req.params;
    const {username, email} = req.body;
    try {
        const updateUser = await User.findByIdAndUpdate(userId, {username, email}, {new: true});
        console.log('Updated:', updateUser)
        res.redirect(`/profile/${userId}`)
    } catch (error) {
        next(error)
        
    }
  });

  router.post ('delete/userId', async (req, res, next) => {
    const { userId } = req.params;
    try {
        await User.findByIdAndDelete(userId)
        res.redirect('index')
    } catch (error) {
        
    }
  })
  


module.exports = router;