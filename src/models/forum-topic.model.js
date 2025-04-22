/**
 * @swagger
 * components:
 *   schemas:
 *     ForumTopic:
 *       type: object
 *       required:
 *         - forum_id
 *         - title
 *         - content
 *         - created_by
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the forum topic
 *         forum_id:
 *           type: integer
 *           description: ID of the forum this topic belongs to
 *         title:
 *           type: string
 *           description: The title of the topic
 *         content:
 *           type: string
 *           description: The content of the topic
 *         created_by:
 *           type: integer
 *           description: ID of the user who created the topic
 *         is_pinned:
 *           type: boolean
 *           description: Whether the topic is pinned
 *         is_closed:
 *           type: boolean
 *           description: Whether the topic is closed for new posts
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the topic was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the topic was last updated
 */

module.exports = (sequelize, DataTypes) => {
  const ForumTopic = sequelize.define('ForumTopic', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    forum_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'forums',
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'forum_topics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ForumTopic.associate = (models) => {
    ForumTopic.belongsTo(models.Forum, {
      foreignKey: 'forum_id',
      as: 'forum'
    });
    
    ForumTopic.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    
    ForumTopic.hasMany(models.ForumPost, {
      foreignKey: 'topic_id',
      as: 'posts'
    });
  };

  return ForumTopic;
};
