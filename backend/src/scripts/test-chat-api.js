/**
 * Test script to verify chat API functionality
 */
const db = require('../models');
const { User, Chat, ChatParticipant, Message } = db;

async function testChatAPI() {
  try {
    console.log('Starting chat API test...');

    // Test database connection
    try {
      await db.sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (dbError) {
      console.error('Unable to connect to the database:', dbError);
      return;
    }

    // Find an admin user
    const adminUser = await User.findOne({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      console.error('No admin user found in the database.');
      return;
    }

    console.log(`Found admin user: ${adminUser.first_name} ${adminUser.last_name} (ID: ${adminUser.id})`);

    // Find a non-admin user
    const targetUser = await User.findOne({
      where: { role: { [db.Sequelize.Op.ne]: 'admin' } }
    });

    if (!targetUser) {
      console.error('No target user found in the database.');
      return;
    }

    console.log(`Found target user: ${targetUser.first_name} ${targetUser.last_name} (ID: ${targetUser.id})`);

    // Create a test chat
    console.log('Creating a test chat...');
    const chat = await Chat.create({
      name: 'Test Chat',
      is_group: false,
      created_by: adminUser.id
    });

    console.log(`Test chat created with ID: ${chat.id}`);

    // Add participants
    console.log('Adding participants...');

    // Add admin with created_at timestamp
    await db.sequelize.query(
      `INSERT INTO chat_participants (chat_id, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
      {
        replacements: [chat.id, adminUser.id]
      }
    );

    // Add target user with created_at timestamp
    await db.sequelize.query(
      `INSERT INTO chat_participants (chat_id, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
      {
        replacements: [chat.id, targetUser.id]
      }
    );

    console.log('Participants added successfully');

    // Add a test message
    console.log('Adding a test message...');
    const message = await Message.create({
      chat_id: chat.id,
      sender_id: adminUser.id,
      content: 'This is a test message'
    });

    console.log(`Test message created with ID: ${message.id}`);

    // Verify the chat was created correctly
    const verifyChat = await Chat.findByPk(chat.id, {
      include: [
        {
          model: User,
          as: 'participants',
          through: { attributes: [] }
        },
        {
          model: Message,
          as: 'messages'
        }
      ]
    });

    console.log('Verification results:');
    console.log(`- Chat ID: ${verifyChat.id}`);
    console.log(`- Chat name: ${verifyChat.name}`);
    console.log(`- Participants: ${verifyChat.participants.length}`);
    console.log(`- Messages: ${verifyChat.messages.length}`);

    // Clean up
    console.log('Cleaning up test data...');

    try {
      // Delete messages first (foreign key constraint)
      console.log('Deleting messages...');
      await Message.destroy({ where: { chat_id: chat.id } });

      // Delete chat participants
      console.log('Deleting chat participants...');
      await db.sequelize.query(
        `DELETE FROM chat_participants WHERE chat_id = ?`,
        {
          replacements: [chat.id]
        }
      );

      // Delete the chat
      console.log('Deleting chat...');
      await Chat.destroy({ where: { id: chat.id } });

      console.log('Cleanup completed successfully');
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close the database connection
    await db.sequelize.close();
    process.exit(0);
  }
}

// Run the test
testChatAPI();
