const products = [
    {
      id: '1',
      name: 'sticker',
      src: 'https://cdn.shopify.com/s/files/1/0434/0285/4564/products/Sticker-mock.png?v=1623256356',
      price: '$8.00',
      quantity: 1,
    },
    // Add more products as needed
  ];

  
  export default async function (req, res) {
    const { id } = req.query;
    const product = products.find((p) => p.id === id);
  
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
  
    res.status(200).json(product);
  }
