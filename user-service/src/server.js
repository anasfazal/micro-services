import app from './app.js';

const PORT = process.env.USER_SERVICE_PORT || 5001;

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});