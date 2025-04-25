/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - created_by
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the chat
 *         name:
 *           type: string
 *           description: The name of the chat (for group chats)
 *         is_group:
 *           type: boolean
 *           description: Whether this is a group chat
 *         created_by:
 *           type: integer
 *           description: ID of the user who created the chat
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the chat was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the chat was last updated
 */

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_group: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'chats',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Chat.associate = (models) => {
    Chat.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    
    Chat.belongsToMany(models.User, {
      through: 'chat_participants',
      foreignKey: 'chat_id',
      otherKey: 'user_id',
      as: 'participants'
    });
    
    Chat.hasMany(models.Message, {
      foreignKey: 'chat_id',
      as: 'messages'
    });
  };

  return Chat;
};
