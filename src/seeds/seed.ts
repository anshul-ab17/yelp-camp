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
  const defaultImages = Array.from({ length: 17 }, (_, i) => ({
    url: `/seeds/camp_${i + 1}.jpg`,
    filename: `YelpCamp/local_camp_${i + 1}`,
  }));

  const campDescriptions = [
    "Nestled deep in the pine forest, this campground offers absolute solitude, quiet starry nights, and access to pristine hiking trails.",
    "A perfect spot for families and kayak enthusiasts. Located right beside a crystal-clear lake with sandy beach shores and kayak rentals.",
    "An elevation camper's dream! Wake up to stunning panoramic mountain vistas, fresh alpine air, and rugged backcountry paths.",
    "Enjoy peaceful camping beneath towering redwood trees, with the relaxing sound of a gentle creek flowing right beside your tent pitch.",
    "A desert oasis camper site. Experience magical sunsets over the canyons, unique rock formations, and clear skies perfect for stargazing.",
    "Secluded forest camping with spacious gravel sites, fire rings, picnic tables, and clean restroom amenities. Pet friendly!",
    "Wake up to the sounds of ocean waves crashing. Coastal campsites on grassy cliffs overlooking the Pacific with spectacular sunset views.",
    "A quiet grassy meadow surrounded by birch trees. Ideal for bird watching, wildflowers, and relaxing around a warm campfire.",
    "Beautiful camping spot situated along a roaring river. Perfect for fly fishing, swimming in natural pools, and white water rafting.",
    "A remote wilderness camp accessible only by 4x4 or hiking. Perfect for pure backcountry campers looking to escape the crowds."
  ];

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const cityData = cities[random1000];
    const price = Math.floor(Math.random() * 20) + 10;
    const title = `${sample(descriptors)} ${sample(places)}`;
    const description = sample(campDescriptions);

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
