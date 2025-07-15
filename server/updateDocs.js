// run node updateDocs.js in cmd

require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log('Connected to database successfully.');


    const db = mongoose.connection.db;    
    
    // edit code from here
    const result = await db.collection('Users').updateMany(
      {
        currentlyQueued: { $exists: false },
        matchHistory: { $exists: false },
      },
      {
        $set: {
          currentlyQueued: [],
          matchHistory: [],
        },
      }
    );
    // end

    console.log(`${result.modifiedCount} documents updated successfully.`);
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

main();
