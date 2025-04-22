const http = require('http');
const app = require('./server');
const db = require('./models');
const { testConnection } = require('./config/db.config');
const socketService = require('./services/socket.service');

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Test database connection
testConnection()
  .then(success => {
    if (success) {
      // Sync database models
      db.sequelize.sync({ alter: true })
        .then(() => {
          console.log('Database synchronized successfully');

          // Initialize Socket.IO
          socketService.initialize(server);
          console.log('Socket.IO initialized');

          // Start the server
          server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
          });
        })
        .catch(error => {
          console.error('Error synchronizing database:', error);
          process.exit(1);
        });
    } else {
      console.error('Failed to connect to the database');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
