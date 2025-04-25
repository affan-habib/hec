module.exports = (sequelize, DataTypes) => {
  const ChatParticipant = sequelize.define('ChatParticipant', {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'chat_participants',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['chat_id', 'user_id']
      }
    ]
  });

  ChatParticipant.associate = (models) => {
    ChatParticipant.belongsTo(models.Chat, {
      foreignKey: 'chat_id',
      as: 'chat'
    });
    
    ChatParticipant.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return ChatParticipant;
};
