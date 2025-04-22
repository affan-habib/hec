const bcrypt = require('bcrypt');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - first_name
 *         - last_name
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 *         first_name:
 *           type: string
 *           description: The user's first name
 *         last_name:
 *           type: string
 *           description: The user's last name
 *         role:
 *           type: string
 *           enum: [student, tutor, admin]
 *           description: The user's role
 *         profile_image:
 *           type: string
 *           description: URL to the user's profile image
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was last updated
 */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('student', 'tutor', 'admin'),
      allowNull: false,
      defaultValue: 'student'
    },
    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  User.prototype.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.hasOne(models.StudentProfile, {
      foreignKey: 'user_id',
      as: 'studentProfile'
    });

    User.hasOne(models.TutorProfile, {
      foreignKey: 'user_id',
      as: 'tutorProfile'
    });

    User.hasOne(models.AdminProfile, {
      foreignKey: 'user_id',
      as: 'adminProfile'
    });

    User.hasMany(models.Diary, {
      foreignKey: 'user_id',
      as: 'diaries'
    });

    User.hasMany(models.Skin, {
      foreignKey: 'created_by',
      as: 'createdSkins'
    });

    User.belongsToMany(models.Award, {
      through: 'user_awards',
      foreignKey: 'user_id',
      otherKey: 'award_id',
      as: 'awards'
    });

    User.hasMany(models.Chat, {
      foreignKey: 'created_by',
      as: 'createdChats'
    });

    User.belongsToMany(models.Chat, {
      through: 'chat_participants',
      foreignKey: 'user_id',
      otherKey: 'chat_id',
      as: 'participatingChats'
    });

    User.hasMany(models.Message, {
      foreignKey: 'sender_id',
      as: 'sentMessages'
    });

    User.hasMany(models.Forum, {
      foreignKey: 'created_by',
      as: 'createdForums'
    });

    User.hasMany(models.ForumTopic, {
      foreignKey: 'created_by',
      as: 'createdTopics'
    });

    User.hasMany(models.ForumPost, {
      foreignKey: 'created_by',
      as: 'createdPosts'
    });

    User.hasMany(models.Image, {
      foreignKey: 'uploaded_by',
      as: 'uploadedImages'
    });
  };

  return User;
};
