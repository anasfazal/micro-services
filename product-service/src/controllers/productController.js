import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS_CODES } from '../utils/statusCodes.js';
import { productModel } from '../models/productModel.js';

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const sellerId = req.user.id;

  if (!name || !description || !price) {
    return res.status(HTTP_STATUS_CODES.BadRequest).json({
      status: HTTP_STATUS_CODES.BadRequest,
      message: 'All fields are required'
    });
  }

  const productId = await productModel.create({
    name,
    description,
    price,
    sellerId
  });

  res.status(HTTP_STATUS_CODES.Created).json({
    status: HTTP_STATUS_CODES.Created,
    data: { productId }
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await productModel.findAll();
  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    data: products
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  
  if (!product) {
    return res.status(HTTP_STATUS_CODES.NotFound).json({
      status: HTTP_STATUS_CODES.NotFound,
      message: 'Product not found'
    });
  }

  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    data: product
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const sellerId = req.user.id;
  const updates = req.body;

  const success = await productModel.update(productId, sellerId, updates);
  
  if (!success) {
    return res.status(HTTP_STATUS_CODES.NotFound).json({
      status: HTTP_STATUS_CODES.NotFound,
      message: 'Product not found or unauthorized'
    });
  }

  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    message: 'Product updated successfully'
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const sellerId = req.user.id;

  const success = await productModel.delete(productId, sellerId);
  
  if (!success) {
    return res.status(HTTP_STATUS_CODES.NotFound).json({
      status: HTTP_STATUS_CODES.NotFound,
      message: 'Product not found or unauthorized'
    });
  }

  res.status(HTTP_STATUS_CODES.OK).json({
    status: HTTP_STATUS_CODES.OK,
    message: 'Product deleted successfully'
  });
});