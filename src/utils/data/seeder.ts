import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import ProductModel from './../../database/models/Product';
import './../../database';

const productsFilePath = path.join(__dirname, 'products.json');
const productsData = fs.readFileSync(productsFilePath, 'utf8');
const products = JSON.parse(productsData);

async function seedDatabase() {
  try {
    // Insert the products into the database
    await ProductModel.insertMany(products);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    // Disconnect from the database when finished
    mongoose.disconnect();
  }
}

seedDatabase();
