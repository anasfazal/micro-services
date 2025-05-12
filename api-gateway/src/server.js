import app from './app.js';

const PORT = process.env.GATEWAY_PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});