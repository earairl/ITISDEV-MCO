require('dotenv').config();
const mongoose = require('mongoose');

async function wipeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log('Connected to database successfully.');

    const db = mongoose.connection.db; 
    const collections = await db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared ${collection.collectionName}`);
    }

    console.log('All collections wiped');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error wiping database: ', err);
  }
}

wipeDatabase();
