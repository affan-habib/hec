/**
 * @swagger
 * components:
 *   schemas:
 *     Skin:
 *       type: object
 *       required:
 *         - name
 *         - theme_data
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the skin
 *         name:
 *           type: string
 *           description: The name of the skin
 *         description:
 *           type: string
 *           description: Description of the skin
 *         theme_data:
 *           type: object
 *           description: JSON data containing the skin's theme properties
 *         created_by:
 *           type: integer
 *           description: ID of the user who created the skin
 *         is_public:
 *           type: boolean
 *           description: Whether the skin is publicly available
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the skin was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the skin was last updated
 */

module.exports = (sequelize, DataTypes) => {
  const Skin = sequelize.define('Skin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    theme_data: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('theme_data');
        if (rawValue) {
          try {
            return JSON.parse(rawValue);
          } catch (error) {
            console.error('Error parsing theme_data:', error);
            return rawValue;
          }
        }
        return null;
      },
      set(value) {
        if (typeof value === 'object') {
          this.setDataValue('theme_data', JSON.stringify(value));
        } else {
          this.setDataValue('theme_data', value);
        }
      }
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'skins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Skin.associate = (models) => {
    Skin.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Skin.hasMany(models.DiaryPage, {
      foreignKey: 'skin_id',
      as: 'diaryPages'
    });
  };

  return Skin;
};
