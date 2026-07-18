import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Campground from '../models/Campground';
import Review from '../models/Review';
import User from '../models/User';
import cities from './cities.js';
// @ts-ignore
import { descriptors, places } from './seedHelpers.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yelp-camp';

const sample = (array: any[]) => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Database connected.');

  // 1. Clear existing data
  console.log('Clearing old campgrounds, reviews, and users...');
  await Campground.deleteMany({});
  await Review.deleteMany({});
  await User.deleteMany({});

  // 2. Create a default owner user
  console.log('Creating default admin user...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);
  const admin = new User({
    email: 'admin@yelpcamp.com',
    username: 'admin',
    passwordHash,
  });
  await admin.save();
  console.log('Admin user created successfully.');

  // 3. Seed campgrounds
  console.log('Seeding campgrounds...');
  const defaultImages = [
    {
      url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
      filename: 'YelpCamp/forest_camping_1',
    },
    {
      url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80',
      filename: 'YelpCamp/forest_camping_2',
    },
    {
      url: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=1200&q=80',
      filename: 'YelpCamp/forest_camping_3',
    },
    {
      url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80',
      filename: 'YelpCamp/forest_camping_4',
    },
  ];

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const cityData = cities[random1000];
    const price = Math.floor(Math.random() * 20) + 10;
    const title = `${sample(descriptors)} ${sample(places)}`;
    const description =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero recusandae quos ducimus, ad, architecto possimus eum, laboriosam magnam voluptatum rem? Ipsum ea iure aliquid accusamus mollitia molestias facere.';

    // Pick 2 random images
    const img1 = sample(defaultImages);
    let img2 = sample(defaultImages);
    while (img1.url === img2.url) {
      img2 = sample(defaultImages);
    }

    const camp = new Campground({
      author: admin._id,
      location: `${cityData.city}, ${cityData.state}`,
      title,
      description,
      price,
      geometry: {
        type: 'Point',
        coordinates: [cityData.longitude, cityData.latitude],
      },
      images: [img1, img2],
    });

    await camp.save();
  }

  console.log('Seeding completed successfully.');
  await mongoose.connection.close();
  console.log('Database connection closed.');
}

seedDB().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
