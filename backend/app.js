import express from 'express';
const app = express();
import product from './routes/productRoutes.js';
import user from './routes/userRoutes.js';
import errorHandleMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';

// Using cookie parser
app.use(cookieParser());

// Middleware
app.use(express.json());

// Route
app.use('/api/v1', product);
app.use('/api/v1', user);

app.use(errorHandleMiddleware);


export default app;