export default {
    createCartsTable: `
      CREATE TABLE IF NOT EXISTS carts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    
    createCartItemsTable: `
      CREATE TABLE IF NOT EXISTS cart_items (
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        PRIMARY KEY (cart_id, product_id)
      )`,
  
    createCart: `INSERT INTO carts (user_id) VALUES (?)`,
    getCartByUserId: `SELECT id FROM carts WHERE user_id = ?`,
    addToCart: `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    
    getCartDetails: `
      SELECT 
        c.id AS cart_id,
        product_id,
        quantity
      FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.user_id = ?`,
    
    updateCartItem: `
      UPDATE cart_items
      SET quantity = ?
      WHERE cart_id = ? AND product_id = ?`,
    
    removeFromCart: `
      DELETE FROM cart_items
      WHERE cart_id = ? AND product_id = ?`,
    
    clearCart: `DELETE FROM cart_items WHERE cart_id = ?`
  };