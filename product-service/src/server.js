import app from './app.js';

const PORT = process.env.PRODUCT_SERVICE_PORT || 5002;

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});