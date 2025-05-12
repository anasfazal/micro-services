import db from '../config/db.js';
import redisClient from '../config/redis.js';
import queries from '../config/queries.js';
import axios from 'axios';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';

const PRODUCTS_TTL = 3600; // 1 hour
const PRODUCT_TTL = 1800; // 30 minutes

export const productModel = {
  create: async (productData) => {
    try {
      // Validate seller exists
      const sellerResponse = await axios.get(
        `${process.env.USER_SERVICE_URL}/users/${productData.sellerId}`
      );
      
      if (sellerResponse.status !== 200) {
        throw new Error('Seller not found');
      }

      const [result] = await db.query(queries.insertProduct, [
        productData.name,
        productData.description,
        productData.price,
        productData.sellerId
      ]);
      
      await redisClient.del('products:all');
      return result.insertId;
    } catch (error) {
      throw new Error('Failed to create product');
    }
  },

  findAll: async () => {
    try {
      const cacheKey = 'products:all';
      const cachedProducts = await redisClient.get(cacheKey);
      if (cachedProducts) return JSON.parse(cachedProducts);

      const [products] = await db.query(queries.selectAllProducts);
      await redisClient.setex(cacheKey, PRODUCTS_TTL, JSON.stringify(products));
      return products;
    } catch (error) {
      throw new Error('Failed to retrieve products');
    }
  },

  findById: async (id) => {
    try {
      const cacheKey = `products:${id}`;
      const cachedProduct = await redisClient.get(cacheKey);
      if (cachedProduct) return JSON.parse(cachedProduct);

      const [product] = await db.query(queries.selectProductById, [id]);
      if (!product[0]) return null;

      await redisClient.setex(cacheKey, PRODUCT_TTL, JSON.stringify(product[0]));
      return product[0];
    } catch (error) {
      throw new Error('Failed to retrieve product');
    }
  },

  update: async (id, sellerId, updates) => {
    try {
      const [result] = await db.query(queries.updateProduct, [
        updates.name,
        updates.description,
        updates.price,
        id,
        sellerId
      ]);
      
      await redisClient.del(`products:${id}`);
      await redisClient.del('products:all');
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to update product');
    }
  },

  delete: async (id, sellerId) => {
    try {
      const [result] = await db.query(queries.deleteProduct, [id, sellerId]);
      await redisClient.del(`products:${id}`);
      await redisClient.del('products:all');
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  }
};