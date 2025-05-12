export default {
  createProductsTable: `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      seller_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

  insertProduct: `
    INSERT INTO products (name, description, price, seller_id)
    VALUES (?, ?, ?, ?)`,

  selectAllProducts: `SELECT * FROM products`,

  selectProductById: `SELECT * FROM products WHERE id = ?`,

  updateProduct: `
    UPDATE products 
    SET name = ?, description = ?, price = ?
    WHERE id = ? AND seller_id = ?`,

  deleteProduct: `DELETE FROM products WHERE id = ? AND seller_id = ?`
};