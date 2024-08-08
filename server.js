const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Good = require('./models/Good');
mongoose.connect('mongodb://localhost/mongodb://localhost:27017/goodsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




const app = express();
app.use(bodyParser.json());
app.use(cors());

let goodsList = [];

// Get all goods
app.get('/api/goods', (req, res) => {
  res.json(goodsList);
});

// Add a new goods
app.post('/api/goods', (req, res) => {
  const newGoods = req.body;
  goodsList.push(newGoods);
  res.status(201).json(newGoods);
});

// Update a goods
app.put('/api/goods/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < goodsList.length) {
    const updatedGoods = req.body;
    goodsList[index] = updatedGoods;
    res.json(updatedGoods);
  } else {
    res.status(404).json({ message: 'Goods not found' });
  }
});

// Delete a goods
app.delete('/api/goods/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < goodsList.length) {
    goodsList.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Goods not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/api/goods', async (req, res) => {
    try {
      const goods = await Good.find();
      res.json(goods);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app.post('/api/goods', async (req, res) => {
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
