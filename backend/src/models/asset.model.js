module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'asset_categories',
        key: 'id'
      }
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnail_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_free: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    points_required: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'assets',
    timestamps: true,
    underscored: true
  });

  Asset.associate = (models) => {
    Asset.belongsTo(models.AssetCategory, {
      foreignKey: 'category_id',
      as: 'category'
    });
    
    Asset.belongsToMany(models.User, {
      through: models.UserAsset,
      foreignKey: 'asset_id',
      otherKey: 'user_id',
      as: 'users'
    });
  };

  return Asset;
};
