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

  return Diary;
};
