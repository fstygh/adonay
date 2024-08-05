const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
app.use(cors());

const app = express();
const PORT = 5050;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
function loadGoods(filter = 'all') {
    var goodsContainer = document.getElementById('goodsContainer');
    goodsContainer.innerHTML = ''; // Clear the container
  
    // Make a GET request to the backend server to retrieve the goodsList
    fetch('https://your-backend-server.com/api/goods')
      .then(response => response.json())
      .then(data => {
        var goodsList = data;
  
        goodsList.forEach(function(goods, index) {
          if (filter === 'all' || goods.category === filter) {
            var goodsItem = document.createElement('div');
            goodsItem.className = 'goods-item';
  
            var img = document.createElement('img');
            img.src = goods.image;
            goodsItem.appendChild(img);
  
            var price = document.createElement('p');
            price.textContent = 'Price: $' + goods.price;
            goodsItem.appendChild(price);
  
            var description = document.createElement('p');
            description.textContent = 'Description: ' + goods.description;
            goodsItem.appendChild(description);
  
            var contact = document.createElement('p');
            contact.textContent = goods.contact;
            goodsItem.appendChild(contact);
  
            var editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.onclick = function() {
              editGoods(index);
            };
            goodsItem.appendChild(editBtn);
  
            var deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
              deleteGoods(index);
            };
            goodsItem.appendChild(deleteBtn);
  
            goodsContainer.appendChild(goodsItem);
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  