'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_assets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      asset_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'assets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      purchased_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      purchase_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      points_spent: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add a unique constraint to prevent duplicate user-asset pairs
    await queryInterface.addIndex('user_assets', ['user_id', 'asset_id'], {
      unique: true,
      name: 'user_assets_user_id_asset_id_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_assets');
  }
};
