// Run the database initialization script
require('./src/config/init-db')
  .initDatabase()
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
