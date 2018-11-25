let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require("body-parser"),
    request = require('request'),
    requestPromise = require('request-promise'),
    pantryRoutes = require('./routes/pantry.js'),
    FoodItem = require('./models/foodItem'),
    favoritesRoutes = require('./routes/favorites.js');
    
    
let app = express();
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));


mongoose.connect("mongodb://localhost:27017/pantry-planner", {useNewUrlParser: true});
//mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));


let cartItemSchema = {
    label: String,
    foodItems: [{foodItem:String}]
}

let CartItem = mongoose.model("CartItem", cartItemSchema);


app.get("/", function(req,res){
    
    res.render("home");
});


// Search Routes

app.get('/search',function(req,res){
    res.render('search');
});


app.post("/search",function(req,res){
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

// CART ROUTES


app.get("/cart",function(req,res){
    
  
    CartItem.find({}, function(err, recipes){
        if(err){
            res.redirect("/");
        }else{
            res.render("cart/cart",{recipes: recipes});
        }
    })
})


app.post("/cart", function(req,res){
    
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

app.delete("/cart/:id",function(req,res){
    CartItem.findByIdAndRemove(req.params.id,function(err,deletedItem){
        if(err){
            res.redirect("/");
        }else{
            res.end();
        }
    });
});


//  FAVORITES ROUTES
app.use("/favorites", favoritesRoutes);


// PANTRY ROUTES
app.use("/pantry",pantryRoutes);





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server running....");
});