/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       required:
 *         - filename
 *         - original_name
 *         - mime_type
 *         - size
 *         - url
 *         - uploaded_by
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the image
 *         filename:
 *           type: string
 *           description: The filename on the server
 *         original_name:
 *           type: string
 *           description: The original filename
 *         mime_type:
 *           type: string
 *           description: The MIME type of the image
 *         size:
 *           type: integer
 *           description: The size of the image in bytes
 *         url:
 *           type: string
 *           description: The URL to access the image
 *         uploaded_by:
 *           type: integer
 *           description: ID of the user who uploaded the image
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the image was uploaded
 */

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Image.associate = (models) => {
    Image.belongsTo(models.User, {
      foreignKey: 'uploaded_by',
      as: 'uploader'
    });
  };

  return Image;
};
