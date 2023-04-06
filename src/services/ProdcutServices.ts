import ProductModel from './../database/models/Product';
import Factory from './ModelServices';

export const getProducts = Factory.getAll(ProductModel, 'Product');

export const getSingleProdcut = Factory.getOne(ProductModel);

export const createProduct = Factory.createOne(ProductModel);

export const updateProduct = Factory.updateOne(ProductModel);

export const deleteProduct = Factory.deleteOne(ProductModel);
