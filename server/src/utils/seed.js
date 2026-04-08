import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/product.model.js';
import VariantType from '../models/variant_types.model.js';
import Option from '../models/option.model.js';
import Combination from '../models/combination.model.js';
import Order from '../models/order.model.js';

// Load env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const categories = ['Shirt', 'Hoodie', 'Pant', 'Bag', 'Watch', 'Shoe', 'Hat', 'Accessory'];
const styles = ['Premium', 'Classic', 'Standard', 'Oversized', 'Slim Fit', 'Designer', 'Eco', 'Vintage'];
const images = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1544816153-199d821b397e?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000'
];

const generateProducts = (count) => {
  const seededProducts = [];
  for (let i = 1; i <= count; i++) {
    const style = styles[Math.floor(Math.random() * styles.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const image = images[Math.floor(Math.random() * images.length)];

    // Random stock: every 5th product is out of stock (0)
    const stock = (i % 7 === 0) ? 0 : Math.floor(Math.random() * 100) + 1;
    const price = parseFloat((Math.random() * (150 - 10) + 10).toFixed(2));

    seededProducts.push({
      name: `${style} ${category} #${i}`,
      description: `Description for ${style} ${category}. This is a high-quality product from our latest collection.`,
      base_price: price,
      stock: stock,
      image: image,
    });
  }
  return seededProducts;
};

const products = generateProducts(50);

const seedDatabase = async () => {
  try {
    const MONGO_URI = `${process.env.MONGO_URI}${process.env.DB_NAME}`;
    console.log(`🌱 Using MongoDB URI: ${MONGO_URI}`);
    console.log('🌱 Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected.');

    // Clear existing data (optional - be careful in production!)
    console.log('🧹 Cleaning existing product data...');
    await Product.deleteMany({});
    await VariantType.deleteMany({});
    await Option.deleteMany({});
    await Combination.deleteMany({});
    await Order.deleteMany({});
    console.log('✨ Database cleaned.');

    console.log('📦 Seeding simple products...');
    await Product.insertMany(products);

    const count = await Product.countDocuments();
    console.log(`✅ Successfully seeded ${count} products.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
