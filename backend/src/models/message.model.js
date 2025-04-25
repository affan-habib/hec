/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - chat_id
 *         - sender_id
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the message
 *         chat_id:
 *           type: integer
 *           description: ID of the chat this message belongs to
 *         sender_id:
 *           type: integer
 *           description: ID of the user who sent the message
 *         content:
 *           type: string
 *           description: The content of the message
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the message was created
 */

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chats',
        key: 'id'
      }
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Chat, {
      foreignKey: 'chat_id',
      as: 'chat'
    });
    
    Message.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender'
    });
  };

  return Message;
};
