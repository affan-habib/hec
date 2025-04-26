'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('diary_feedbacks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      diary_page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'diary_pages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tutor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      marks: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 100
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add a unique constraint to ensure one tutor can provide only one feedback per diary page
    await queryInterface.addConstraint('diary_feedbacks', {
      fields: ['diary_page_id', 'tutor_id'],
      type: 'unique',
      name: 'unique_diary_page_tutor'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('diary_feedbacks');
  }
};
