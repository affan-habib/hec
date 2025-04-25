/**
 * @swagger
 * components:
 *   schemas:
 *     ForumPost:
 *       type: object
 *       required:
 *         - topic_id
 *         - content
 *         - created_by
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the forum post
 *         topic_id:
 *           type: integer
 *           description: ID of the topic this post belongs to
 *         content:
 *           type: string
 *           description: The content of the post
 *         created_by:
 *           type: integer
 *           description: ID of the user who created the post
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the post was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the post was last updated
 */

module.exports = (sequelize, DataTypes) => {
  const ForumPost = sequelize.define('ForumPost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'forum_topics',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'forum_posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ForumPost.associate = (models) => {
    ForumPost.belongsTo(models.ForumTopic, {
      foreignKey: 'topic_id',
      as: 'topic'
    });
    
    ForumPost.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  };

  return ForumPost;
};
