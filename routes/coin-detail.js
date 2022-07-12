const router = require("express").Router();
const CoinGecko = require('coingecko-api');
const User = require('../models/User');
const CoinGeckoClient = new CoinGecko();

// @desc    Shows detailed information of the required coin
// @route   GET /coin-detail/"coin name"
// @access  Private
router.get('/:coin', isLoggedIn, async (req, res, next) => {  
    const userFromCookie = req.session.currentUser;
    const {coin} = req.params
           
    try {
        const user = await User.findById(userFromCookie._id);
        const data = await CoinGeckoClient.coins.fetch(`${coin}`, {tickers:false, community_data:false, developer_data:false, localization:false, sparkline:true});
        
        let avgSparkline=function(array){
            let sum=0
            array.forEach(ele=>{
                sum+=ele
            })
            return sum/array.length
        }
        
        const dayOne=avgSparkline(data.data.market_data.sparkline_7d.price.slice(0,24))
        const dayTwo=avgSparkline(data.data.market_data.sparkline_7d.price.slice(24,48))
        const dayThree=avgSparkline(data.data.market_data.sparkline_7d.price.slice(48,72))
        const dayFour=avgSparkline(data.data.market_data.sparkline_7d.price.slice(72,96))
        const dayFive=avgSparkline(data.data.market_data.sparkline_7d.price.slice(96,120))
        const daySix=avgSparkline(data.data.market_data.sparkline_7d.price.slice(120,144))
        const daySeven=avgSparkline(data.data.market_data.sparkline_7d.price.slice(144,168))

        const sparkline=[dayOne,dayTwo,dayThree,dayFour,dayFive,daySix,daySeven]

        res.render('coin-detail',{user,data,sparkline} );        
    } catch (error) {
        next(error)
    }
  });


module.exports = router;