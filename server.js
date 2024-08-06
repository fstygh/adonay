const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Goods = require('./models/goods');

const app = express();
const PORT = 4000;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/mydatabase';
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

// Session middleware setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
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

// Update goods
app.put('/update-goods/:id', upload.single('goodsImage'), async (req, res) => {
    const { id } = req.params;
    const { goodsImageUrl, goodsPrice, goodsDescription, goodsCategory } = req.body;
    const goodsImage = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : goodsImageUrl;
    const contactInfo = "Contact: example@example.com";

    if (!goodsImage) {
        return res.status(400).send("Please provide an image.");
    }

    try {
        const updatedGoods = await Goods.findByIdAndUpdate(id, {
            image: goodsImage,
            price: goodsPrice,
            description: goodsDescription,
            category: goodsCategory,
            contact: contactInfo
        }, { new: true });

        if (!updatedGoods) {
            return res.status(404).send("Goods not found.");
        }

        res.json(updatedGoods);
    } catch (error) {
        res.status(500).send("Error updating goods: " + error.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
