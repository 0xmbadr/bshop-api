import mongoose from 'mongoose';
import { db } from '../config';

// Build the connection string
const DB_URI = `mongodb://${db.host}:${db.port}/${db.name}`;

// Create the database connection
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Successfully Connected to Mongo DB');
  })
  .catch((e) => {
    console.log('Error occurred while trying to connect to MongoDB');
    console.log(e);
  });

// ! ==== CONNECTION EVENTS =====

// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ' + DB_URI);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  console.log('MongoDB is closing..');
  mongoose.connection.close();
  process.exit(0);
});
