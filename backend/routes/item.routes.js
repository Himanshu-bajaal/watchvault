const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

router.post('/', async(req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async(req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async(req,res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true,
        });
        if(!updatedItem){
            return res.status(404).json({ message: "Item not found" });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async(req,res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if(!deletedItem){
            return res.status(404).json({ message: "Item not found" });
        }
        res.json({ message: "Item deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

module.exports = router;