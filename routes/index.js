const router = require('express').Router();

// @desc    App home page
// @route   GET /
// @access  Public
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  if (user) {
    res.redirect('/profile');
    return;
  } else {
    res.render('index');
  }
});

module.exports = router;
