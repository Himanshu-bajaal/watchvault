const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const axios = require("axios");
const protect = require("../middlewares/auth.middleware"); // blocks this route until a valid login cookie is present

router.post('/', protect, async (req, res) => {
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

                console.log('OMDB Response:', omdbRes.data); // TODO: remove — leftover debug line

                if (omdbRes.data.Response === 'True') {
                    extraData = {
                        poster: omdbRes.data.Poster !== 'N/A' ? omdbRes.data.Poster : '',
                        year: omdbRes.data.Year,
                        plot: omdbRes.data.Plot,
                    };
                }
            } catch (err) {
                // OMDb failure shouldn't block item creation — just save without poster/year/plot
                console.error('Error fetching data from OMDB:', err);
            }
        }
        const newItem = await Item.create({
            title,
            type,
            user: req.userId, // tags this item as belonging to whoever is logged in
            ...extraData
        });

        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        // ownership check — confirms this item belongs to the logged-in user before allowing an update
        const item = await Item.findOne({ _id: req.params.id, user: req.userId });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,           // return the updated document, not the old one
            runValidators: true, // re-run schema validation (enum, min/max) on update, not just on create
        });

        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        // same ownership check as PUT — prevents deleting someone else's item even with a guessed ID
        const item = await Item.findOne({ _id: req.params.id, user: req.userId });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const { status } = req.query; // e.g. ?status=watched
        // always scoped to the logged-in user — status filter is optional on top of that
        const filter = status ? { status, user: req.userId } : { user: req.userId };
        const items = await Item.find(filter).sort({ createdAt: -1 }); // -1 = newest first
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;