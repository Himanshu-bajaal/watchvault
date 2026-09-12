const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const axios = require("axios");

router.post('/', async (req, res) => {
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
        const newItem = await Item.create({ title, type, ...extraData });
        res.status(201).json(newItem);
    }   catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const items = await Item.find(filter).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;