let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require("body-parser"),
    pantryRoutes = require('./routes/pantry.js'),
    favoritesRoutes = require('./routes/favorites.js'),
    searchRoutes = require('./routes/search.js'),
    cartRoutes = require("./routes/cart.js");
    
    
let app = express();
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));


//mongoose.connect("mongodb://localhost:27017/pantry-planner", {useNewUrlParser: true});
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function(req,res){
    
    res.render("search");
});



// CART ROUTES
app.use("/cart", cartRoutes);


//  FAVORITES ROUTES
app.use("/favorites", favoritesRoutes);


// PANTRY ROUTES
app.use("/pantry",pantryRoutes);

// SEARCH ROUTES
app.use("/search", searchRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server running....");
});