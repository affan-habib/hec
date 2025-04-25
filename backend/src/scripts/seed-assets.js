const db = require('../models');
const { Asset, AssetCategory } = db;

const seedAssets = async () => {
  try {
    console.log('Starting to seed assets...');
    
    // Check if assets already exist
    const existingCount = await Asset.count();
    if (existingCount > 0) {
      console.log(`${existingCount} assets already exist. Skipping seeding.`);
      return;
    }
    
    // Get all categories
    const categories = await AssetCategory.findAll();
    if (categories.length === 0) {
      console.log('No asset categories found. Please run seed-asset-categories.js first.');
      return;
    }
    
    // Create a map of category names to IDs
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.name] = category.id;
    });
    
    // Sample assets for each category
    const sampleAssets = [
      // Emoticons
      {
        name: 'Happy Face',
        description: 'A smiling emoticon',
        category_id: categoryMap['Emoticons'],
        image_url: 'https://img.icons8.com/emoji/96/000000/grinning-face-emoji.png',
        thumbnail_url: 'https://img.icons8.com/emoji/48/000000/grinning-face-emoji.png',
        price: 0,
        is_premium: false,
        is_free: true,
        points_required: 0,
        display_order: 1,
        is_active: true
      },
      {
        name: 'Sad Face',
        description: 'A sad emoticon',
        category_id: categoryMap['Emoticons'],
        image_url: 'https://img.icons8.com/emoji/96/000000/sad-face-emoji.png',
        thumbnail_url: 'https://img.icons8.com/emoji/48/000000/sad-face-emoji.png',
        price: 0,
        is_premium: false,
        is_free: true,
        points_required: 0,
        display_order: 2,
        is_active: true
      },
      {
        name: 'Love Eyes',
        description: 'An emoticon with heart eyes',
        category_id: categoryMap['Emoticons'],
        image_url: 'https://img.icons8.com/emoji/96/000000/heart-eyes-emoji.png',
        thumbnail_url: 'https://img.icons8.com/emoji/48/000000/heart-eyes-emoji.png',
        price: 1.99,
        is_premium: true,
        is_free: false,
        points_required: 50,
        display_order: 3,
        is_active: true
      },
      {
        name: 'Laughing',
        description: 'A laughing emoticon',
        category_id: categoryMap['Emoticons'],
        image_url: 'https://img.icons8.com/emoji/96/000000/face-with-tears-of-joy-emoji.png',
        thumbnail_url: 'https://img.icons8.com/emoji/48/000000/face-with-tears-of-joy-emoji.png',
        price: 0.99,
        is_premium: false,
        is_free: false,
        points_required: 25,
        display_order: 4,
        is_active: true
      },
      
      // Backgrounds
      {
        name: 'Blue Sky',
        description: 'A clear blue sky background',
        category_id: categoryMap['Backgrounds'],
        image_url: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=600&auto=format&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=100&auto=format&fit=crop',
        price: 0,
        is_premium: false,
        is_free: true,
        points_required: 0,
        display_order: 1,
        is_active: true
      },
      {
        name: 'Mountain View',
        description: 'A scenic mountain background',
        category_id: categoryMap['Backgrounds'],
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&auto=format&fit=crop',
        price: 2.99,
        is_premium: true,
        is_free: false,
        points_required: 75,
        display_order: 2,
        is_active: true
      },
      {
        name: 'Beach Sunset',
        description: 'A beautiful beach sunset background',
        category_id: categoryMap['Backgrounds'],
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
        thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop',
        price: 1.99,
        is_premium: true,
        is_free: false,
        points_required: 50,
        display_order: 3,
        is_active: true
      },
      
      // Stickers
      {
        name: 'Gold Star',
        description: 'A gold star sticker',
        category_id: categoryMap['Stickers'],
        image_url: 'https://img.icons8.com/emoji/96/000000/star-emoji.png',
        thumbnail_url: 'https://img.icons8.com/emoji/48/000000/star-emoji.png',
        price: 0,
        is_premium: false,
        is_free: true,
        points_required: 0,
        display_order: 1,
        is_active: true
      },
      {
        name: 'Heart',
        description: 'A heart sticker',
        category_id: categoryMap['Stickers'],
        image_url: 'https://img.icons8.com/emoji/96/000000/red-heart.png',
        thumbnail_url: 'https://img.icons8.com/emoji/48/000000/red-heart.png',
        price: 0.99,
        is_premium: false,
        is_free: false,
        points_required: 25,
        display_order: 2,
        is_active: true
      },
      {
        name: 'Trophy',
        description: 'A trophy sticker',
        category_id: categoryMap['Stickers'],
        image_url: 'https://img.icons8.com/emoji/96/000000/trophy-emoji.png',
        thumbnail_url: 'https://img.icons8.com/emoji/48/000000/trophy-emoji.png',
        price: 1.99,
        is_premium: true,
        is_free: false,
        points_required: 50,
        display_order: 3,
        is_active: true
      },
      
      // Avatars
      {
        name: 'Default Avatar',
        description: 'Default user avatar',
        category_id: categoryMap['Avatars'],
        image_url: 'https://img.icons8.com/color/96/000000/user.png',
        thumbnail_url: 'https://img.icons8.com/color/48/000000/user.png',
        price: 0,
        is_premium: false,
        is_free: true,
        points_required: 0,
        display_order: 1,
        is_active: true
      },
      {
        name: 'Student Avatar',
        description: 'Student avatar',
        category_id: categoryMap['Avatars'],
        image_url: 'https://img.icons8.com/color/96/000000/student-male.png',
        thumbnail_url: 'https://img.icons8.com/color/48/000000/student-male.png',
        price: 1.99,
        is_premium: false,
        is_free: false,
        points_required: 50,
        display_order: 2,
        is_active: true
      },
      {
        name: 'Teacher Avatar',
        description: 'Teacher avatar',
        category_id: categoryMap['Avatars'],
        image_url: 'https://img.icons8.com/color/96/000000/teacher.png',
        thumbnail_url: 'https://img.icons8.com/color/48/000000/teacher.png',
        price: 2.99,
        is_premium: true,
        is_free: false,
        points_required: 75,
        display_order: 3,
        is_active: true
      },
      
      // Frames
      {
        name: 'Simple Frame',
        description: 'A simple profile picture frame',
        category_id: categoryMap['Frames'],
        image_url: 'https://img.icons8.com/color/96/000000/picture-frame.png',
        thumbnail_url: 'https://img.icons8.com/color/48/000000/picture-frame.png',
        price: 0,
        is_premium: false,
        is_free: true,
        points_required: 0,
        display_order: 1,
        is_active: true
      },
      {
        name: 'Gold Frame',
        description: 'A gold profile picture frame',
        category_id: categoryMap['Frames'],
        image_url: 'https://img.icons8.com/color/96/000000/picture-frame-gold.png',
        thumbnail_url: 'https://img.icons8.com/color/48/000000/picture-frame-gold.png',
        price: 2.99,
        is_premium: true,
        is_free: false,
        points_required: 100,
        display_order: 2,
        is_active: true
      }
    ];
    
    // Create assets
    await Asset.bulkCreate(sampleAssets);
    
    console.log(`Successfully seeded ${sampleAssets.length} assets!`);
  } catch (error) {
    console.error('Error seeding assets:', error);
  } finally {
    // Close the database connection
    await db.sequelize.close();
  }
};

// Run the seed function
seedAssets();
