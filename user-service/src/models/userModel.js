import db from '../config/db.js';
import redisClient from '../config/redis.js';
import queries from '../config/queries.js';
import bcrypt from 'bcrypt';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';

const USER_TTL = 1800; // 30 minutes

export const userModel = {
  createUser: async (name, email, password, role) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(queries.insertUser, [
        name,
        email,
        hashedPassword,
        role
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  },

  getUserByEmail: async (email) => {
    try {
      const cacheKey = `user:email:${email}`;
      const cachedUser = await redisClient.get(cacheKey);
      if (cachedUser) return JSON.parse(cachedUser);

      const [rows] = await db.query(queries.getUserByEmail, [email]);
      if (!rows.length) return null;

      await redisClient.setex(cacheKey, USER_TTL, JSON.stringify(rows[0]));
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get user by email');
    }
  },

  getUserById: async (id) => {
    try {
      const cacheKey = `user:id:${id}`;
      const cachedUser = await redisClient.get(cacheKey);
      if (cachedUser) return JSON.parse(cachedUser);

      const [rows] = await db.query(queries.getUserById, [id]);
      if (!rows.length) return null;

      await redisClient.setex(cacheKey, USER_TTL, JSON.stringify(rows[0]));
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get user by ID');
    }
  },

  updateUser: async (id, updates) => {
    try {
      let hashedPassword;
      if (updates.password) {
        hashedPassword = await bcrypt.hash(updates.password, 10);
      }

      const [result] = await db.query(queries.updateUser, [
        updates.name,
        updates.email,
        hashedPassword || updates.password,
        updates.role,
        id
      ]);

      await redisClient.del([`user:id:${id}`, `user:email:${updates.email}`]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  },

  deleteUser: async (id) => {
    try {
      const [result] = await db.query(queries.deleteUser, [id]);
      await redisClient.del(`user:id:${id}`);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
};