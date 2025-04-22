/**
 * @swagger
 * components:
 *   schemas:
 *     Award:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the award
 *         name:
 *           type: string
 *           description: The name of the award
 *         description:
 *           type: string
 *           description: Description of the award
 *         image_url:
 *           type: string
 *           description: URL to the award image
 *         points:
 *           type: integer
 *           description: Points value of the award
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the award was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the award was last updated
 */

module.exports = (sequelize, DataTypes) => {
  const Award = sequelize.define('Award', {
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
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'awards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Award.associate = (models) => {
    Award.belongsToMany(models.User, {
      through: 'user_awards',
      foreignKey: 'award_id',
      otherKey: 'user_id',
      as: 'users'
    });
  };

  return Award;
};
