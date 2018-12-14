let express = require("express"),
    router = express.Router(),
    request = require('request');
    
    
// Search Routes

router.get('/',function(req,res){
    res.render('search');
});


router.post("/",function(req,res){
    let recipes = [];
    let foodItem = req.body.foodItem;
    request(`https://api.edamam.com/search?q=${foodItem}&to=20&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`,function(error,response,body){
        if(!error && response.statusCode == 200){
            
            let parsedBody = JSON.parse(body);
            for(let i =0; i< parsedBody.hits.length; i++){
                recipes.push({
                    label: parsedBody.hits[i].recipe.label,
                    image: parsedBody.hits[i].recipe.image,
                    url: parsedBody.hits[i].recipe.url,
                    ingredients : parsedBody.hits[i].recipe.ingredientLines,
                    id : parsedBody.hits[i].recipe.uri.split("_").pop().toString()
                });
            }
            res.send(recipes);
        
        }
        
    });
    
});

module.exports = router;