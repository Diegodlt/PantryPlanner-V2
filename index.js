let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require("body-parser"),
    request = require('request'),
    pantryRoutes = require('./routes/pantry.js'),
    favoritesRoutes = require('./routes/favorites.js');
    
    
let app = express();
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));


mongoose.connect("mongodb://localhost:27017/pantry-planner", {useNewUrlParser: true});
//mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));


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


//  FAVORITES ROUTES
app.use("/favorites", favoritesRoutes);


// PANTRY ROUTES
app.use("/pantry",pantryRoutes);





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server running....");
})