/**
 * @swagger
 * components:
 *   schemas:
 *     AdminProfile:
 *       type: object
 *       required:
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the admin profile
 *           example: 3
 *         user_id:
 *           type: integer
 *           description: ID of the user this profile belongs to
 *           example: 1
 *         department:
 *           type: string
 *           description: The admin's department
 *           example: "Management"
 *           enum: [Management, Technical, Support, Content, Marketing]
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the profile was created
 *           example: "2023-01-15T09:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the profile was last updated
 *           example: "2023-03-20T14:25:00Z"
 */

module.exports = (sequelize, DataTypes) => {
  const AdminProfile = sequelize.define('AdminProfile', {
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
    department: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'admin_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  AdminProfile.associate = (models) => {
    AdminProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return AdminProfile;
};
