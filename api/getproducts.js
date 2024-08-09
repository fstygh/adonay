const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const dataFilePath = path.join(process.cwd(), 'goods.json');

  // Helper function to read data from the JSON file
  const readData = () => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  };

  // Helper function to write data to the JSON file
  const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  };

  switch (req.method) {
    case 'GET':
      // Return all products
      const goods = readData();
      res.status(200).json(goods);
      break;

    case 'POST':
      // Add a new product
      const newGoods = req.body;
      const goodsData = readData();
      goodsData.push(newGoods);
      writeData(goodsData);
      res.status(201).json(newGoods);
      break;

    case 'PUT':
      // Update an existing product
      const { id } = req.query;
      const updatedGoods = req.body;
      let goodsToUpdate = readData();
      goodsToUpdate = goodsToUpdate.map((item) =>
        item.id === id ? { ...item, ...updatedGoods } : item
      );
      writeData(goodsToUpdate);
      res.status(200).json(updatedGoods);
      break;

    case 'DELETE':
      // Delete a product
      const { id: deleteId } = req.query;
      let goodsToDelete = readData();
      goodsToDelete = goodsToDelete.filter((item) => item.id !== deleteId);
      writeData(goodsToDelete);
      res.status(204).end();
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
