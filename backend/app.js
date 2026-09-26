import express from 'express';
const app = express();
import product from './routes/productRoutes.js';

// Middleware
app.use(express.json());

// Route

app.use('/api/v1', product);


export default app;