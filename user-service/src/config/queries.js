export default {
  createUsersTable: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'seller', 'customer') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

  insertUser: `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)`,

  getUserByEmail: `SELECT * FROM users WHERE email = ?`,
  getUserById: `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
  getAllUsers: `SELECT id, name, email, role, created_at FROM users`,
  updateUser: `
    UPDATE users 
    SET name = ?, email = ?, password = ?, role = ?
    WHERE id = ?`,
  deleteUser: `DELETE FROM users WHERE id = ?`
};