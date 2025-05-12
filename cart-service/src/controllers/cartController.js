import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';
import { cartModel } from '../models/cartModel.js';

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity || quantity < 1) {
    return res.status(HTTP_STATUS_CODES.BadRequest).json({
      status: HTTP_STATUS_CODES.BadRequest,
      message: 'Valid product ID and quantity required'
    });
  }

  await cartModel.addItem(req.user.id, productId, quantity);
  
  res.status(HTTP_STATUS_CODES.Created).json({
    status: HTTP_STATUS_CODES.Created,
    message: 'Item added to cart'
  });
});

export const getCart = asyncHandler(async (req, res) => {
  const cartItems = await cartModel.getCart(req.user.id);
  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    data: cartItems
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(HTTP_STATUS_CODES.BadRequest).json({
      status: HTTP_STATUS_CODES.BadRequest,
      message: 'Valid quantity required'
    });
  }

  const updated = await cartModel.updateItem(req.user.id, productId, quantity);
  
  if (!updated) {
    return res.status(HTTP_STATUS_CODES.NotFound).json({
      status: HTTP_STATUS_CODES.NotFound,
      message: 'Cart item not found'
    });
  }

  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    message: 'Cart item updated'
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const removed = await cartModel.removeItem(req.user.id, productId);
  
  if (!removed) {
    return res.status(HTTP_STATUS_CODES.NotFound).json({
      status: HTTP_STATUS_CODES.NotFound,
      message: 'Cart item not found'
    });
  }

  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    message: 'Item removed from cart'
  });
});