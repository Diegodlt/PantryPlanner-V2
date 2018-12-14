let express = require("express"),
    router = express.Router(),
    requestPromise = require('request-promise'),
    async = require('async'),
    FoodItem = require('../models/foodItem'),
    CartItem = require('../models/cartItem');
    

router.get("/",function(req,res){
    let data = {};
    async.parallel([
        function(callback){
            CartItem.find({}, function(err,item){
                if(err){
                    return callback(err);
                }
                data.recipes = item;
                callback();
            });
        },
        function(callback){
            FoodItem.find({}, function(err,item){
                if(err){
                    return callback(err);
                }
                data.foodItems = item;
                callback();
            });
        }
    ], function(err){
        if(err){
            console.log("error");
        }
        res.render("cart/cart", {recipes:data.recipes, pantryItems: data.foodItems});
    }
    );
});


router.post("/", function(req,res){
    
    let label = req.body.recipeLabel;
    let ingredients = req.body.parsedIngredients;
    let cartItem ={
        label: label,
        foodItems: []
    };
    let cartItemId;
    
     CartItem.create(cartItem, function(err, newItem){
        if(err){
            res.redirect("/favorites")
        }else{
            cartItemId = newItem.id;
        }
    });
    
    ingredients.forEach((ingredient)=> {
        let options = {
            uri : 'https://api.edamam.com/api/food-database/parser',
            qs : {
                ingr: ingredient,
                app_id: "0ec2c75c",
                app_key: "8ed44a101b9f481e897c3a03b0b8ccd2"
            },
            headers :{
                'User-Agent' : 'Request-Promise'
            },
            json : true
        };
        
        requestPromise(options)
            .then(function(response){
                CartItem.findById(cartItemId,function(err,item){
                    if(err){
                        console.log("error")
                    }else{
                        console.log(item);
                        let foodItem = response.hints[0].food.label;
                        item.foodItems.push({foodItem: foodItem});
                    }
                    item.save(function(err,savedItem){
                        if(err){
                            console.log(err);
                        }else {
                            console.log(savedItem);
                        }
                    });
                });
            });
    });
});

router.delete("/:id",function(req,res){
    CartItem.findByIdAndRemove(req.params.id,function(err,deletedItem){
        if(err){
            res.redirect("/");
        }else{
            res.end();
        }
    });
});


module.exports = router;