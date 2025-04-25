/**
 * @swagger
 * components:
 *   schemas:
 *     Diary:
 *       type: object
 *       required:
 *         - user_id
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the diary
 *         user_id:
 *           type: integer
 *           description: ID of the user who owns the diary
 *         title:
 *           type: string
 *           description: The title of the diary
 *         description:
 *           type: string
 *           description: The description of the diary
 *         is_public:
 *           type: boolean
 *           description: Whether the diary is publicly available
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the diary was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the diary was last updated
 *         pages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DiaryPage'
 *           description: The pages in this diary
 */

const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Diary = sequelize.define('Diary', {
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'diaries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Diary.associate = (models) => {
    Diary.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Diary.hasMany(models.DiaryPage, {
      foreignKey: 'diary_id',
      as: 'pages'
    });
  };

  // Static methods
  Diary.getAll = async (publicOnly = false, userId = null, limit = null, offset = 0) => {
    const where = {};

    if (publicOnly) {
      where.is_public = true;
    }

    if (userId) {
      where.user_id = userId;
    }

    const options = {
      where,
      order: [['updated_at', 'DESC']],
      include: [{
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    };

    // Apply pagination if limit is provided
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    return await Diary.findAll(options);
  };

  Diary.countAll = async (publicOnly = false, userId = null) => {
    const where = {};

    if (publicOnly) {
      where.is_public = true;
    }

    if (userId) {
      where.user_id = userId;
    }

    return await Diary.count({ where });
  };

  Diary.findById = async (id, includePages = false) => {
    const options = {
      where: { id },
      include: [{
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    };

    if (includePages) {
      options.include.push({
        model: sequelize.models.DiaryPage,
        as: 'pages',
        order: [['created_at', 'DESC']]
      });
    }

    return await Diary.findOne(options);
  };

  Diary.update = async (id, data) => {
    await Diary.update(data, { where: { id } });
    return await Diary.findById(id);
  };

  Diary.delete = async (id) => {
    return await Diary.destroy({ where: { id } });
  };

  return Diary;
};
