import db from '../config/db.js';
import redisClient from '../config/redis.js';
import queries from '../config/queries.js';
import axios from 'axios';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';

const CART_TTL = 300; // 5 minutes

export const cartModel = {
  getOrCreateCart: async (userId) => {
    const cacheKey = `cart:${userId}`;
    try {
      const cachedCart = await redisClient.get(cacheKey);
      if (cachedCart) return JSON.parse(cachedCart).id;

      const [cart] = await db.query(queries.getCartByUserId, [userId]);
      if (!cart.length) {
        const [result] = await db.query(queries.createCart, [userId]);
        const newCart = { id: result.insertId, user_id: userId };
        await redisClient.setex(cacheKey, CART_TTL, JSON.stringify(newCart));
        return newCart.id;
      }
      
      await redisClient.setex(cacheKey, CART_TTL, JSON.stringify(cart[0]));
      return cart[0].id;
    } catch (error) {
      throw new Error('Failed to get/create cart');
    }
  },

  addItem: async (userId, productId, quantity) => {
    try {
      // Validate product exists
      const productResponse = await axios.get(
        `http://${process.env.PRODUCT_SERVICE_URL}/products/${productId}`
      );
      
      if (productResponse.status !== 200) {
        throw new Error('Product not found');
      }

      const cartId = await cartModel.getOrCreateCart(userId);
      await db.query(queries.addToCart, [cartId, productId, quantity]);
      await redisClient.del(`cart:items:${userId}`);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Failed to add item to cart');
    }
  },

  getCart: async (userId) => {
    const cacheKey = `cart:items:${userId}`;
    try {
      const cachedItems = await redisClient.get(cacheKey);
      if (cachedItems) return JSON.parse(cachedItems);

      const [items] = await db.query(queries.getCartDetails, [userId]);
      
      // Enrich with product details
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          const productResponse = await axios.get(
            `http://${process.env.PRODUCT_SERVICE_URL}/products/${item.product_id}`
          );
          return {
            ...item,
            product: productResponse.data.data
          };
        })
      );

      await redisClient.setex(cacheKey, CART_TTL, JSON.stringify(enrichedItems));
      return enrichedItems;
    } catch (error) {
      throw new Error('Failed to get cart details');
    }
  },

  updateItem: async (userId, productId, quantity) => {
    try {
      const cartId = await cartModel.getOrCreateCart(userId);
      const [result] = await db.query(queries.updateCartItem, [
        quantity,
        cartId,
        productId
      ]);
      await redisClient.del(`cart:items:${userId}`);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to update cart item');
    }
  },

  removeItem: async (userId, productId) => {
    try {
      const cartId = await cartModel.getOrCreateCart(userId);
      const [result] = await db.query(queries.removeFromCart, [cartId, productId]);
      await redisClient.del(`cart:items:${userId}`);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to remove item from cart');
    }
  }
};