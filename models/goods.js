const mongoose = require('mongoose');

const GoodSchema = new mongoose.Schema({
  image: String,
  price: Number,
  description: String,
  category: String,
  contact: String,
});

module.exports = mongoose.model('Good', GoodSchema);

