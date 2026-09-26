import app from './app.js';
import dotenv from 'dotenv';
import {connectMongoDatabase} from './config/db.js';
dotenv.config({ path: './backend/config/config.env' });

// Connecting to MongoDB
connectMongoDatabase();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})  