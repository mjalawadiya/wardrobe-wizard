import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wardrobeWizardDB';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', productRoutes);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve static files from the /src/res/tshirt directory for product images
app.use('/images/tshirts', express.static(path.join(__dirname, '../src/res/tshirt')));

// Fallback route for client-side routing in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
