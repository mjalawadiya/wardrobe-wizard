import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  productName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  fabric: {
    type: String,
    required: true
  },
  pattern: {
    type: String,
    required: true
  },
  fitType: {
    type: String,
    required: true
  },
  weatherSuitability: {
    type: String,
    required: true
  },
  occasion: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  modelDisplayUrl: {
    type: String
  },
  userRatings: {
    type: Number,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  keywords: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product; 