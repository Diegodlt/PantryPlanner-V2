let express = require("express"),
    FavoriteRecipe = require("../models/favoriteRecipe.js"),
    router = express.Router();


router.get("/", function(req,res){
    FavoriteRecipe.find({}, function(err, favoriteItems){
        if(err){
            res.redirect("/");
        }else{
            res.render("favorites",{favoriteItems:favoriteItems})
        }
    })
})


router.post('/',function(req,res){
    FavoriteRecipe.create(req.body,function(err, newItem){
        if(err){
            console.log("error in /favorites POST")
        }else{
            console.log(newItem);
        }
    })
    
});

router.delete('/:id',function(req,res){
    FavoriteRecipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/")
        }else{
            res.end();
        }
    });
})


module.exports = router;