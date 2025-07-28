import mongoose from 'mongoose';
import Campground from '../models/campground';
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl)
    .then(() => {
        console.log("Database connected for seeding");
    })
    .catch(err => {
        console.error("Database connection error for seeding:", err);
    });

const sample = (array: any[]) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '654321098765432109876543',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Experience nature at its finest! Nestled under a canopy of lush green trees, this campsite offers the perfect getaway for outdoor enthusiasts and families alike. Enjoy stargazing, hiking trails, clean spring water, and cozy campfires.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    filename: 'YelpCamp/default-camp-1'
                },
                {
                    url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    filename: 'YelpCamp/default-camp-2'
                }
            ]
        });
        await camp.save();
    }
};

seedDB().then(() => {
    console.log("Seeding completed successfully.");
    mongoose.connection.close();
});
