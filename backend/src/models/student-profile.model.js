/**
 * @swagger
 * components:
 *   schemas:
 *     StudentProfile:
 *       type: object
 *       required:
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the student profile
 *           example: 1
 *         user_id:
 *           type: integer
 *           description: ID of the user this profile belongs to
 *           example: 5
 *         level:
 *           type: string
 *           description: The student's English proficiency level
 *           example: "Intermediate"
 *           enum: [Beginner, Elementary, Pre-Intermediate, Intermediate, Upper-Intermediate, Advanced, Proficient]
 *         learning_goals:
 *           type: string
 *           description: The student's learning goals
 *           example: "Improve conversation skills and prepare for IELTS exam"
 *         interests:
 *           type: string
 *           description: The student's interests
 *           example: "Reading, Music, Travel, Movies"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the profile was created
 *           example: "2023-05-15T14:30:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the profile was last updated
 *           example: "2023-06-20T09:15:00Z"
 */

module.exports = (sequelize, DataTypes) => {
  const StudentProfile = sequelize.define('StudentProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    learning_goals: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    interests: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'student_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  StudentProfile.associate = (models) => {
    StudentProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return StudentProfile;
};
