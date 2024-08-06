const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5050;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors());

// Session middleware setup
app.use(session({
    secret: 'your-secret-key', // Change this to a secure key
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

// Handle form submission
app.post('/submit-form', upload.single('goodsImage'), (req, res) => {
    const { goodsImageUrl, goodsPrice, goodsDescription, goodsCategory } = req.body;
    const goodsImage = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : goodsImageUrl;
    const contactInfo = "Contact: example@example.com"; // Fixed contact information

    if (!goodsImage) {
        return res.status(400).send("Please provide an image.");
    }

    const goods = {
        image: goodsImage,
        price: goodsPrice,
        description: goodsDescription,
        category: goodsCategory,
        contact: contactInfo
    };

    let goodsList = req.session.goodsList || [];
    goodsList.push(goods);
    req.session.goodsList = goodsList;

    res.redirect('/');
});

// Get goods list (for frontend fetching)
app.get('/api/goods', (req, res) => {
    res.json(req.session.goodsList || []);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
