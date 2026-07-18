import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yelp-camp';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface GlobalWithMongoose {
  mongooseCachedConn?: typeof mongoose;
  mongooseCachedPromise?: Promise<typeof mongoose>;
}

const globalWithMongo = global as unknown as GlobalWithMongoose;

let cachedConn = globalWithMongo.mongooseCachedConn;
let cachedPromise = globalWithMongo.mongooseCachedPromise;

export async function connectToDatabase() {
  if (cachedConn) {
    return cachedConn;
  }

  if (!cachedPromise) {
    const opts = {
      bufferCommands: false,
    };

    cachedPromise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cachedConn = await cachedPromise;
  } catch (e) {
    cachedPromise = undefined;
    throw e;
  }

  globalWithMongo.mongooseCachedConn = cachedConn;
  globalWithMongo.mongooseCachedPromise = cachedPromise;

  return cachedConn;
}
