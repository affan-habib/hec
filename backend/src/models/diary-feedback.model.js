/**
 * @swagger
 * components:
 *   schemas:
 *     DiaryFeedback:
 *       type: object
 *       required:
 *         - diary_page_id
 *         - tutor_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the feedback
 *         diary_page_id:
 *           type: integer
 *           description: ID of the diary page this feedback is for
 *         tutor_id:
 *           type: integer
 *           description: ID of the tutor who provided the feedback
 *         feedback:
 *           type: string
 *           description: The feedback text
 *         marks:
 *           type: integer
 *           description: The marks given to the diary page (0-100)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the feedback was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the feedback was last updated
 */

module.exports = (sequelize, DataTypes) => {
  const DiaryFeedback = sequelize.define('DiaryFeedback', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    diary_page_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'diary_pages',
        key: 'id'
      }
    },
    tutor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    }
  }, {
    tableName: 'diary_feedbacks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['diary_page_id', 'tutor_id']
      }
    ]
  });

  DiaryFeedback.associate = (models) => {
    DiaryFeedback.belongsTo(models.DiaryPage, {
      foreignKey: 'diary_page_id',
      as: 'diaryPage'
    });

    DiaryFeedback.belongsTo(models.User, {
      foreignKey: 'tutor_id',
      as: 'tutor'
    });
  };

  // Static methods
  DiaryFeedback.findByPageId = async function(pageId) {
    return await this.findOne({
      where: { diary_page_id: pageId },
      include: [{
        model: sequelize.models.User,
        as: 'tutor',
        attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
      }]
    });
  };

  DiaryFeedback.findByTutorId = async function(tutorId, limit = null, offset = 0) {
    const options = {
      where: { tutor_id: tutorId },
      order: [['updated_at', 'DESC']],
      include: [{
        model: sequelize.models.DiaryPage,
        as: 'diaryPage',
        include: [{
          model: sequelize.models.Diary,
          as: 'diary',
          include: [{
            model: sequelize.models.User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }]
        }]
      }]
    };

    // Apply pagination if limit is provided
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    return await this.findAll(options);
  };

  DiaryFeedback.countByTutorId = async function(tutorId) {
    return await this.count({
      where: { tutor_id: tutorId }
    });
  };

  return DiaryFeedback;
};
