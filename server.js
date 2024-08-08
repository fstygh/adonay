const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Good = require('./models/Good');

mongoose.connect('mongodb://localhost/goodsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Get all goods
app.get('/api/goods', async (req, res) => {
  try {
    const goods = await Good.find();
    res.json(goods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new goods
app.post('/public/getproduct.js', async (req, res) => {
  const good = new Good({
    image: req.body.image,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    contact: req.body.contact,
  });

  try {
    const newGood = await good.save();
    res.status(201).json(newGood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a goods
app.put('/public/getproduct.js/:id', async (req, res) => {
  try {
    const good = await Good.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!good) return res.status(404).json({ message: 'Goods not found' });
    res.json(good);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a goods
app.delete('/public/getproduct.js/:id', async (req, res) => {
  try {
    const good = await Good.findByIdAndDelete(req.params.id);
    if (!good) return res.status(404).json({ message: 'Goods not found' });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Import goods from MongoDB Compass
async function importGoodsFromCompass() {
  try {
    // Connect to MongoDB Compass
    const compassDb = mongoose.createConnection('mongodb://localhost/mongodb://localhost:27017/goodsdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Define the schema for the goods in MongoDB Compass
    const compassGoodSchema = new mongoose.Schema({
      image: String,
      price: Number,
      description: String,
      category: String,
      contact: String,
    });

    // Create the model for the goods in MongoDB Compass
    const CompassGood = compassDb.model('CompassGood', compassGoodSchema);

    // Fetch the goods from MongoDB Compass
    const compassGoods = await CompassGood.find();

    // Save the goods to your MongoDB database
    for (const good of compassGoods) {
      const newGood = new Good({
        image: good.image,
        price: good.price,
        description: good.description,
        category: good.category,
        contact: good.contact,
      });

      await newGood.save();
    }

    console.log('Goods imported successfully');

    // Close the connections
    compassDb.close();
    mongoose.connection.close();
  } catch (err) {
    console.error('Error importing goods:', err.message);
  }
}

// Call the function to import goods from MongoDB Compass
importGoodsFromCompass();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
