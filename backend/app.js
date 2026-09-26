import express from 'express';
const app = express();
import product from './routes/productRoutes.js';

// Route

app.use('/api/v1', product);


export default app;