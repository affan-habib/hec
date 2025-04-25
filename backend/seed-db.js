// Run the database seeding script
require('./src/config/seed-db')
  .seedDatabase()
  .then(success => {
    if (success) {
      console.log('Database seeding completed successfully');
    } else {
      console.error('Database seeding failed');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error during database seeding:', error);
    process.exit(1);
  });
