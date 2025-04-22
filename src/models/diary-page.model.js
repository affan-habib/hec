/**
 * @swagger
 * components:
 *   schemas:
 *     DiaryPage:
 *       type: object
 *       required:
 *         - diary_id
 *         - title
 *         - content
 *         - page_number
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the diary page
 *         diary_id:
 *           type: integer
 *           description: ID of the diary this page belongs to
 *         title:
 *           type: string
 *           description: The title of the diary page
 *         content:
 *           type: string
 *           description: The content of the diary page
 *         page_number:
 *           type: integer
 *           description: The page number within the diary
 *         skin_id:
 *           type: integer
 *           description: ID of the skin applied to this page
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the diary page was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the diary page was last updated
 */

module.exports = (sequelize, DataTypes) => {
  const DiaryPage = sequelize.define('DiaryPage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    diary_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'diaries',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    page_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    skin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'skins',
        key: 'id'
      }
    }
  }, {
    tableName: 'diary_pages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['diary_id', 'page_number']
      }
    ]
  });

  DiaryPage.associate = (models) => {
    DiaryPage.belongsTo(models.Diary, {
      foreignKey: 'diary_id',
      as: 'diary'
    });

    DiaryPage.belongsTo(models.Skin, {
      foreignKey: 'skin_id',
      as: 'skin'
    });
  };

  // Class methods
  DiaryPage.getNextPageNumber = async function(diaryId) {
    const result = await this.max('page_number', {
      where: { diary_id: diaryId }
    });

    return (result || 0) + 1;
  };

  return DiaryPage;
};
