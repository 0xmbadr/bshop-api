import CategoryModel from '../database/models/Category';
import Factory from './ModelServices';

export const getCategories = Factory.getAll(CategoryModel, 'Category');

export const getSingleCategory = Factory.getOne(CategoryModel);

export const createCategory = Factory.createOne(CategoryModel);

export const updateCategory = Factory.updateOne(CategoryModel);

export const deleteCategory = Factory.deleteOne(CategoryModel);
