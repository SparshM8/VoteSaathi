import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/votesaathi';
const client = new MongoClient(uri);

let db;

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('votesaathi');
    
    // Ensure collections exist (MongoDB creates them on insert, but we can list them)
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);
    
    const required = ['Users', 'Reminders', 'Queries', 'FakeNewsReports', 'CandidateData'];
    for (const name of required) {
      if (!names.includes(name)) {
        await db.createCollection(name);
        console.log(`Created collection: ${name}`);
      }
    }
    
    return db;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed. Running in logic-only mode (No persistent storage).');
    // Suppress full stack trace for a cleaner terminal experience
    return null;
  }
};

export const getDB = () => db;
