const db = require('../models');
const { AssetCategory } = db;

const sampleAssetCategories = [
  {
    name: 'Emoticons',
    description: 'Expressive emoticons for chat and messages',
    display_order: 1,
    is_active: true
  },
  {
    name: 'Backgrounds',
    description: 'Background images for profiles and diaries',
    display_order: 2,
    is_active: true
  },
  {
    name: 'Stickers',
    description: 'Decorative stickers for diaries and messages',
    display_order: 3,
    is_active: true
  },
  {
    name: 'Avatars',
    description: 'Profile avatars for users',
    display_order: 4,
    is_active: true
  },
  {
    name: 'Frames',
    description: 'Decorative frames for profile pictures',
    display_order: 5,
    is_active: true
  }
];

const seedAssetCategories = async () => {
  try {
    console.log('Starting to seed asset categories...');
    
    // Check if asset categories already exist
    const existingCount = await AssetCategory.count();
    if (existingCount > 0) {
      console.log(`${existingCount} asset categories already exist. Skipping seeding.`);
      return;
    }
    
    // Create asset categories
    await AssetCategory.bulkCreate(sampleAssetCategories);
    
    console.log(`Successfully seeded ${sampleAssetCategories.length} asset categories!`);
  } catch (error) {
    console.error('Error seeding asset categories:', error);
  } finally {
    // Close the database connection
    await db.sequelize.close();
  }
};

// Run the seed function
seedAssetCategories();
