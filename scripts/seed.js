#!/usr/bin/env node

/**
 * Database Seeding Script
 * Technology Intelligence Platform
 * SIH 2024 - Problem Statement 25245
 */

import { insertSampleData } from '../src/utils/sampleData.js';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    const result = await insertSampleData();
    
    if (result.success) {
      console.log('✅ Database seeded successfully!');
      console.log('\n📊 Sample data includes:');
      console.log('- 8 Indian Defense Technologies (BrahMos, Tejas, Chandrayaan, etc.)');
      console.log('- 5 Indian Patents with IN patent numbers');
      console.log('- 8 Indian Organizations (DRDO, ISRO, HAL, etc.)');
      console.log('- 5 Research Publications from Indian sources');
      console.log('- 6 Data Sources (Indian Patent Office, DRDO, ISRO, etc.)');
      console.log('- TRL History and Market Data');
      console.log('- Forecasting Models and Predictions');
      console.log('\n🚀 You can now run `npm run dev` to start the application!');
    } else {
      console.error('❌ Database seeding failed:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
}

seedDatabase();
