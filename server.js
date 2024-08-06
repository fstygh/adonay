const express = require('express');
const mongoose = require('mongoose');
const Goods = require('./models/goods');

const app = express();
const PORT = 4000;

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/goods'; // Change 'goods' to your database name if needed
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
});

// Get goods
app.get('/get-goods', async (req, res) => {
    try {
        const goodsList = await Goods.find({});
        res.json(goodsList);
    } catch (error) {
        res.status(500).send("Error retrieving goods: " + error.message);
    }
});

// Post goods
app.post('/post-goods', async (req, res) => {
    const { goodsImageUrl, goodsPrice, goodsDescription, goodsCategory } = req.body;
    const contactInfo = "Contact: example@example.com";

    const newGoods = new Goods({
        image: goodsImageUrl,
        price: goodsPrice,
        description: goodsDescription,
        category: goodsCategory,
        contact: contactInfo
    });

    try {
        const savedGoods = await newGoods.save();
        res.json(savedGoods);
    } catch (error) {
        res.status(500).send("Error saving goods: " + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
