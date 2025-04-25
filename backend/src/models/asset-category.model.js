module.exports = (sequelize, DataTypes) => {
  const AssetCategory = sequelize.define('AssetCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'asset_categories',
    timestamps: true,
    underscored: true
  });

  AssetCategory.associate = (models) => {
    AssetCategory.hasMany(models.Asset, {
      foreignKey: 'category_id',
      as: 'assets'
    });
  };

  return AssetCategory;
};
