const router = require("express").Router();
const CoinGecko = require('coingecko-api');


const CoinGeckoClient = new CoinGecko();




router.get('/', isLoggedIn, async (req, res, next) => {  
         
    try {
        let btc = [967.6,957.02,190.78];
        sparkline.sparkline(document.querySelector(".btc"), btc);
        //const data = await CoinGeckoClient.coins.fetch('bitcoin', {tickers: false, community_data: false, developer_data:false, localization:false, sparkline: true}); 
        //const retrievePriceUsd = data
        //res.json(retrievePriceUsd)
        res.render('favorites', sparkline);        
    } catch (error) {
        next(error)
        
    }
    
  });




module.exports = router;