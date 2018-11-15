let mongoose = require("mongoose");

let favoriteRecipeSchema ={
    label : String,
    image : String,
    ingredients: [],
    url: String
}

module.exports = mongoose.model("FavoriteRecipe", favoriteRecipeSchema);
