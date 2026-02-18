/**
 * Bulk Import Script
 *
 * Imports sample users and items from JSON files into MongoDB.
 * Passwords are automatically hashed via the Mongoose pre-save hook.
 *
 * Usage:
 *   npx tsx scripts/import-data.ts              # Import both users and items
 *   npx tsx scripts/import-data.ts --users      # Import users only
 *   npx tsx scripts/import-data.ts --items      # Import items only
 *   npx tsx scripts/import-data.ts --clean      # Clear existing data before import
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// ---------- Inline model definitions (to avoid Next.js / alias issues) ----------

import bcrypt from 'bcryptjs';

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Item Schema
const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

// ---------- Import logic ----------

const args = process.argv.slice(2);
const importUsers = args.includes('--users') || (!args.includes('--items'));
const importItems = args.includes('--items') || (!args.includes('--users'));
const cleanFirst = args.includes('--clean');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Make sure .env.local exists.');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected.\n');

  try {
    let adminUserId: mongoose.Types.ObjectId | null = null;

    // ── Users ──
    if (importUsers) {
      const usersPath = path.resolve(__dirname, '../sample-data/users.json');
      const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

      if (cleanFirst) {
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users.');
      }

      console.log(`📥 Importing ${usersData.length} users...`);
      let created = 0;
      let skipped = 0;

      for (const userData of usersData) {
        const exists = await User.findOne({ email: userData.email });
        if (exists) {
          console.log(`   ⏭️  Skipped (already exists): ${userData.email}`);
          if (!adminUserId && exists.role === 'admin') {
            adminUserId = exists._id as mongoose.Types.ObjectId;
          }
          skipped++;
          continue;
        }
        const user = await User.create(userData);
        if (!adminUserId && user.role === 'admin') {
          adminUserId = user._id as mongoose.Types.ObjectId;
        }
        console.log(`   ✅ Created: ${userData.email} (${userData.role})`);
        created++;
      }

      console.log(`\n   Users: ${created} created, ${skipped} skipped.\n`);
    }

    // ── Items ──
    if (importItems) {
      // We need a user ID to set as createdBy
      if (!adminUserId) {
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
          adminUserId = admin._id as mongoose.Types.ObjectId;
        } else {
          console.error('❌ No admin user found. Import users first (or use without --items flag).');
          process.exit(1);
        }
      }

      const itemsPath = path.resolve(__dirname, '../sample-data/items.json');
      const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'));

      if (cleanFirst) {
        await Item.deleteMany({});
        console.log('🗑️  Cleared existing items.');
      }

      console.log(`📥 Importing ${itemsData.length} items...`);
      let created = 0;
      let skipped = 0;

      for (const itemData of itemsData) {
        const exists = await Item.findOne({ name: itemData.name });
        if (exists) {
          console.log(`   ⏭️  Skipped (already exists): ${itemData.name}`);
          skipped++;
          continue;
        }
        await Item.create({ ...itemData, createdBy: adminUserId });
        console.log(`   ✅ Created: ${itemData.name}`);
        created++;
      }

      console.log(`\n   Items: ${created} created, ${skipped} skipped.\n`);
    }

    console.log('🎉 Import complete!');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
