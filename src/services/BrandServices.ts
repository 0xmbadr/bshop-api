import BrandModel from '../database/models/Brand';
import Factory from './ModelServices';

export const getBrands = Factory.getAll(BrandModel, 'Brand');

export const getSingleBrand = Factory.getOne(BrandModel);

export const createBrand = Factory.createOne(BrandModel);

export const updateBrand = Factory.updateOne(BrandModel);

export const deleteBrand = Factory.deleteOne(BrandModel);
