module.exports = (sequelize, DataTypes) => {
  const UserAsset = sequelize.define('UserAsset', {
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
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assets',
        key: 'id'
      }
    },
    purchased_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    points_spent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'user_assets',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'asset_id']
      }
    ]
  });

  UserAsset.associate = (models) => {
    UserAsset.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    UserAsset.belongsTo(models.Asset, {
      foreignKey: 'asset_id',
      as: 'asset'
    });
  };

  return UserAsset;
};
