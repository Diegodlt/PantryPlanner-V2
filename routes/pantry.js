let express = require('express'),
    router = express.Router(),
    FoodItem = require("../models/foodItem");
    
    
    
//*** INDEX ROUTE ***//
// This will show all of the pantry items currently in the user's pantry
router.get("/", function(req, res){
    FoodItem.find({}, function(err,foodItems){
        if(err){
            res.redirect("/");
        }else{
            res.render("pantry/pantry", {foodItems: foodItems})
        }
    })
});


// CREATE ROUTE
// This will create a new pantry item
router.post("/", function(req, res){
    console.log(req.body);
    FoodItem.create(req.body, function(err, newItem){
        if(err){
            res.redirect("/pantry/new");
        }else{
           // res.redirect("/pantry");
           res.send(newItem);
            console.log(newItem);
        }
    });
});



// DELETE ROUTE
router.delete("/:id",function(req,res){
    
    FoodItem.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/pantry");
        }else{
            res.end();
        }
    })
});


/* Not needed. The create form is in the same page as the index */
// This will show the form to create a new pantry item 
// router.get("/new",function(req,res){
//     res.render("pantry/new");
// });



module.exports = router;
    
    
