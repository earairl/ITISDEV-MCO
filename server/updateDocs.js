// run node updateDocs.js in cmd

require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log('Connected to database successfully.');


    const db = mongoose.connection.db;    
    
    // edit code from here
    const result = await db.collection('Matches').updateMany(
      {
        date: { $exists: true },
      },
      {
        $unset: { // set to add fields and unset to remove fields
          date: null,
        },
        $set: {
          start: new Date(),
          end: new Date()
        }
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
