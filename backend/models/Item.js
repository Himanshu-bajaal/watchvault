const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["movie" , "book"],
            required: true,
        },
        status:{
            type: String,
            enum: ["want-to-watch" , "watched"],
            default: "want-to-watch",
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default:null,
        },
        review: {
            type: String,
            default: '',
        },
        poster:{
                type: String,
                default: '',
        },
        year:{
            type: String,
            default: '',
        },
        plot:{
            type: String,
            default: '',
        },
            },
        
    { timestamps: true,}
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;