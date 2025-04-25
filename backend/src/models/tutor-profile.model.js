/**
 * @swagger
 * components:
 *   schemas:
 *     TutorProfile:
 *       type: object
 *       required:
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the tutor profile
 *           example: 2
 *         user_id:
 *           type: integer
 *           description: ID of the user this profile belongs to
 *           example: 6
 *         bio:
 *           type: string
 *           description: The tutor's biography
 *           example: "Experienced English tutor with a passion for teaching. I have worked with students of all levels and backgrounds."
 *         specialization:
 *           type: string
 *           description: The tutor's specialization area
 *           example: "Business English"
 *           enum: [General English, Business English, Academic English, Conversation, Exam Preparation, Children's English]
 *         experience:
 *           type: integer
 *           description: The tutor's years of experience
 *           example: 5
 *         hourly_rate:
 *           type: number
 *           format: float
 *           description: The tutor's hourly rate
 *           example: 25.50
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the profile was created
 *           example: "2023-04-10T11:20:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the profile was last updated
 *           example: "2023-07-05T16:45:00Z"
 */

module.exports = (sequelize, DataTypes) => {
  const TutorProfile = sequelize.define('TutorProfile', {
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
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specialization: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    tableName: 'tutor_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TutorProfile.associate = (models) => {
    TutorProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return TutorProfile;
};
