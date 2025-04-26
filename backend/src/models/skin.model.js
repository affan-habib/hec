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

const { Op } = require('sequelize');

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
            // Check if it's already a JSON string
            if (typeof rawValue === 'string') {
              // Try to parse it as JSON
              return JSON.parse(rawValue);
            }
            // If it's already an object, return it as is
            return rawValue;
          } catch (error) {
            console.error('Error parsing theme_data:', error);
            // Return the raw value if parsing fails
            return rawValue;
          }
        }
        // Return default empty theme data if null
        return {
          version: 1,
          elements: [],
          background: {
            color: '#ffffff',
            image: null
          },
          dimensions: {
            width: 800,
            height: 600
          }
        };
      },
      set(value) {
        try {
          // If it's an object, stringify it
          if (typeof value === 'object') {
            this.setDataValue('theme_data', JSON.stringify(value));
          }
          // If it's already a string, check if it's valid JSON
          else if (typeof value === 'string') {
            // Try to parse and re-stringify to ensure valid JSON
            try {
              const parsed = JSON.parse(value);
              this.setDataValue('theme_data', JSON.stringify(parsed));
            } catch (e) {
              // If parsing fails, store as is (might be a simple string)
              this.setDataValue('theme_data', value);
            }
          }
          // For any other type, convert to string
          else {
            this.setDataValue('theme_data', String(value));
          }
        } catch (error) {
          console.error('Error setting theme_data:', error);
          // Set a default value if all else fails
          this.setDataValue('theme_data', JSON.stringify({
            version: 1,
            elements: [],
            background: { color: '#ffffff', image: null },
            dimensions: { width: 800, height: 600 }
          }));
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

  // Static methods
  Skin.getAll = async (publicOnly = false, userId = null, limit = null, offset = 0) => {
    const where = {};

    if (publicOnly) {
      where.is_public = true;
    }

    if (userId) {
      where.created_by = userId;
    }

    const options = {
      where,
      order: [['updated_at', 'DESC']],
      include: [{
        model: sequelize.models.User,
        as: 'creator',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    };

    // Apply pagination if limit is provided
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    return await Skin.findAll(options);
  };

  Skin.countAll = async (publicOnly = false, userId = null) => {
    const where = {};

    if (publicOnly) {
      where.is_public = true;
    }

    if (userId) {
      where.created_by = userId;
    }

    return await Skin.count({ where });
  };

  Skin.findById = async (id) => {
    return await Skin.findOne({
      where: { id },
      include: [{
        model: sequelize.models.User,
        as: 'creator',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    });
  };

  Skin.updateById = async (id, data) => {
    await sequelize.models.Skin.update(data, { where: { id } });
    return await Skin.findById(id);
  };

  Skin.delete = async (id) => {
    return await Skin.destroy({ where: { id } });
  };

  return Skin;
};
