const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const axios = require("axios");
const protect = require("../middlewares/auth.middleware");

router.post('/',protect, async (req, res) => {
    try {
        const { title, type } = req.body;
        let extraData = {};

        if (type === 'movie') {
            try {
                const omdbRes = await axios.get(`http://www.omdbapi.com/`, {
                    params: {
                        apikey: process.env.OMDB_API_KEY,
                        t: title,
                    },
                }); 

                console.log('OMDB Response:', omdbRes.data);

                if (omdbRes.data.Response === 'True') {
                    extraData = {
                        poster: omdbRes.data.Poster !== 'N/A' ? omdbRes.data.Poster : '',
                        year: omdbRes.data.Year,
                        plot: omdbRes.data.Plot,
                    };
                }
            } catch (err) {
                console.error('Error fetching data from OMDB:', err);
            }
        }
        const newItem = await Item.create({
             title,
             type,
             user :req.userId,
             ...extraData
             });

        res.status(201).json(newItem);
    }   catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id',protect, async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, user: req.userId });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id',protect, async (req, res) => {
    try {
        const item = await Item.findOne({_id: req.params.id, user:req.userId});
        if(!item){
            return res.status(404).json({message: "Item not found"});
        }
       await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

router.get('/',protect, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status, user: req.userId } : { user: req.userId };
        const items = await Item.find(filter).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;