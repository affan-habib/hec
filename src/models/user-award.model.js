module.exports = (sequelize, DataTypes) => {
  const UserAward = sequelize.define('UserAward', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    award_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'awards',
        key: 'id'
      }
    },
    awarded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    awarded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_awards',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'award_id']
      }
    ]
  });

  UserAward.associate = (models) => {
    UserAward.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    UserAward.belongsTo(models.Award, {
      foreignKey: 'award_id',
      as: 'award'
    });
    
    UserAward.belongsTo(models.User, {
      foreignKey: 'awarded_by',
      as: 'awarder'
    });
  };

  return UserAward;
};
