import dotenv from 'dotenv';
import app from './app.js';
import { connectMongoDatabase } from './config/db.js';


// Handle Uncaught Exception Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1);
});

// Load configuration before opening the database connection.
dotenv.config({ path: './backend/config/config.env' });

// Connecting to MongoDB
await connectMongoDatabase();

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1);
    });
}); 
