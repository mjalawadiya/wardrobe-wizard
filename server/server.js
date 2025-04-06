import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

// Debug middleware for static files
app.use((req, res, next) => {
  if (req.url.includes('/res/') || req.url.includes('/images/') || req.url.includes('test-image')) {
    console.log('Requesting static file:', req.url);
    
    // Check if the file exists in the public directory
    const filePath = path.join(__dirname, '../public', req.url);
    
    if (fs.existsSync(filePath)) {
      console.log('File exists at:', filePath);
    } else {
      console.log('File does NOT exist at:', filePath);
      // For tshirt images, log more details
      if (req.url.includes('/res/tshirt/')) {
        console.log('Missing tshirt image at path:', filePath);
      }
    }
  }
  next();
});

// Serve static files from the public directory with maximum caching disabled for testing
app.use(express.static(path.join(__dirname, '../public'), {
  etag: false,
  maxAge: '0',
  setHeaders: function(res, path) {
    // Disable caching for all static files
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }
}));

// Direct route for tshirt images
app.get('/res/tshirt/:id.jpg', (req, res) => {
  const tshirtImagePath = path.join(__dirname, '../public/res/tshirt', `${req.params.id}.jpg`);
  
  if (fs.existsSync(tshirtImagePath)) {
    console.log('Serving tshirt image:', tshirtImagePath);
    res.sendFile(tshirtImagePath);
  } else {
    // Fallback to a default image if the requested image doesn't exist
    console.log(`Tshirt image ${req.params.id}.jpg not found, using fallback`);
    res.sendFile(path.join(__dirname, '../public/images/image1.jpeg'));
  }
});

// Special route for test image
app.get('/test-image.jpg', (req, res) => {
  const filePath = path.join(__dirname, '../public/test-image.jpg');
  console.log('Serving test image from specific route:', filePath);
  res.sendFile(filePath);
});

// Direct image test endpoint
app.get('/image-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/test-image.jpg'));
});

// Fallback route for client-side routing in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
