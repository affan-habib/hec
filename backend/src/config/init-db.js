const bcrypt = require('bcrypt');
const db = require('../models');
const dotenv = require('dotenv');

dotenv.config();

const initDatabase = async () => {
  try {
    console.log('Starting database initialization...');

    // Sync all models with the database
    await db.sequelize.sync({ force: true });
    console.log('Database schema created successfully');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);

    const admin = await db.User.create({
      email: 'admin@helloenlishcoaching.com',
      password: adminPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin'
    });

    // Create admin profile
    await db.AdminProfile.create({
      user_id: admin.id,
      department: 'Management'
    });

    console.log('Admin user created successfully');

    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

// Run the initialization if this script is executed directly
if (require.main === module) {
  initDatabase()
    .then(success => {
      if (success) {
        console.log('Database initialization completed successfully');
      } else {
        console.error('Database initialization failed');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error during database initialization:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase };
