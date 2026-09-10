const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const itemRoutes = require("./routes/item.routes");
app.use("/api/items", itemRoutes);

app.get("/", (req, res) => {
    res.send("WatchVault API is running");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})