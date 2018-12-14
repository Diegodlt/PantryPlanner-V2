let mongoose = require("mongoose");


let cartItemSchema = {
    label: String,
    foodItems: [{foodItem:String}]
}

module.exports = mongoose.model("CartItem", cartItemSchema);