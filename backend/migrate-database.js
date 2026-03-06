/**
 * DATABASE MIGRATION SCRIPT
 * Migrates data from 'test' database to 'Lunara' database
 * 
 * Usage: node migrate-database.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Connection URIs
const SOURCE_URI = 'mongodb+srv://Lunara:TeenaRaiKattri@cluster.hynxywh.mongodb.net/test?retryWrites=true&w=majority';
const TARGET_URI = 'mongodb+srv://Lunara:TeenaRaiKattri@cluster.hynxywh.mongodb.net/Lunara?retryWrites=true&w=majority';

// Collections to migrate
const COLLECTIONS = ['users', 'cycles', 'symptoms'];

async function migrateDatabase() {
  console.log('🚀 Starting database migration...\n');

  try {
    // Connect to source database (test)
    console.log('📡 Connecting to source database (test)...');
    const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
    console.log('✅ Connected to source database\n');

    // Connect to target database (Lunara)
    console.log('📡 Connecting to target database (Lunara)...');
    const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();
    console.log('✅ Connected to target database\n');

    // Migrate each collection
    for (const collectionName of COLLECTIONS) {
      console.log(`📦 Migrating collection: ${collectionName}`);
      
      // Get source collection
      const sourceCollection = sourceConn.collection(collectionName);
      const sourceCount = await sourceCollection.countDocuments();
      
      if (sourceCount === 0) {
        console.log(`   ⚠️  No documents found in ${collectionName}`);
        continue;
      }

      console.log(`   📊 Found ${sourceCount} documents`);

      // Get all documents from source
      const documents = await sourceCollection.find({}).toArray();

      // Get target collection
      const targetCollection = targetConn.collection(collectionName);

      // Check if target collection already has data
      const targetCount = await targetCollection.countDocuments();
      if (targetCount > 0) {
        console.log(`   ⚠️  Target collection already has ${targetCount} documents`);
        console.log(`   ❓ Do you want to overwrite? (This script will skip for safety)`);
        console.log(`   💡 Manually delete target collection first if you want to overwrite\n`);
        continue;
      }

      // Insert documents into target
      if (documents.length > 0) {
        await targetCollection.insertMany(documents);
        console.log(`   ✅ Migrated ${documents.length} documents\n`);
      }
    }

    // Verify migration
    console.log('🔍 Verifying migration...\n');
    for (const collectionName of COLLECTIONS) {
      const sourceCount = await sourceConn.collection(collectionName).countDocuments();
      const targetCount = await targetConn.collection(collectionName).countDocuments();
      
      console.log(`   ${collectionName}:`);
      console.log(`      Source (test):   ${sourceCount} documents`);
      console.log(`      Target (Lunara): ${targetCount} documents`);
      
      if (sourceCount === targetCount && sourceCount > 0) {
        console.log(`      ✅ Migration successful\n`);
      } else if (sourceCount === 0) {
        console.log(`      ⚠️  No data to migrate\n`);
      } else {
        console.log(`      ❌ Migration incomplete\n`);
      }
    }

    // Close connections
    await sourceConn.close();
    await targetConn.close();

    console.log('✅ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Verify data in MongoDB Atlas (Lunara database)');
    console.log('   2. Test your application');
    console.log('   3. Delete "test" database if everything works');
    console.log('\n🎉 Done!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

// Run migration
migrateDatabase();
