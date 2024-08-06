// models/goods.js
const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    image: String,
    price: String,
    description: String,
    category: String,
    contact: String
});

const Goods = mongoose.model('Goods', goodsSchema);

module.exports = Goods;
