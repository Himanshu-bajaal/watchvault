const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

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