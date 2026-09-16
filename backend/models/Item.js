const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // stores the _id of the User who owns this item
            ref: "User", // enables .populate() to fetch full user details later if ever needed
            required: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["movie", "book"],
            required: true,
        },
        status: {
            type: String,
            enum: ["want-to-watch", "watched"],
            default: "want-to-watch",
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        review: {
            type: String,
            default: '',
        },
        poster: { // OMDb poster URL — only populated for movies where a match was found
            type: String,
            default: '',
        },
        year: {
            type: String,
            default: '',
        },
        plot: {
            type: String,
            default: '',
        },
    },

    { timestamps: true },
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;