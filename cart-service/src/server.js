import app from './app.js';

const PORT = process.env.CART_SERVICE_PORT || 5003;

app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
});