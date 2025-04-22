/**
 * @swagger
 * components:
 *   schemas:
 *     Forum:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the forum
 *         name:
 *           type: string
 *           description: The name of the forum
 *         description:
 *           type: string
 *           description: Description of the forum
 *         created_by:
 *           type: integer
 *           description: ID of the user who created the forum
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the forum was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the forum was last updated
 */

module.exports = (sequelize, DataTypes) => {
  const Forum = sequelize.define('Forum', {
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'forums',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Forum.associate = (models) => {
    Forum.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    
    Forum.hasMany(models.ForumTopic, {
      foreignKey: 'forum_id',
      as: 'topics'
    });
  };

  return Forum;
};
