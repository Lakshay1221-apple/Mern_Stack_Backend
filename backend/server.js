import dotenv from 'dotenv';
import app from './app.js';
import { connectMongoDatabase } from './config/db.js';

// Load configuration before opening the database connection.
dotenv.config({ path: './backend/config/config.env' });

// Connecting to MongoDB
await connectMongoDatabase();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
