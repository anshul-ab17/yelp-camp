const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const campgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String

});

mongoose.exports = mongoose.model('Campground', campgroundSchema);