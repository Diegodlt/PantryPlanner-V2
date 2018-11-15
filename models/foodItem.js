let mongoose = require("mongoose")

let foodItemSchema = new mongoose.Schema({
    item : String,
    unit: String,
    amount: Number
});


module.exports = mongoose.model("FoodItem", foodItemSchema);