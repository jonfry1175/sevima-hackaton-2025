'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Votes', {
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
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      candidate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Candidates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add unique constraint for one-vote-per-user-per-event
    await queryInterface.addIndex('Votes', ['user_id', 'event_id'], {
      unique: true,
      name: 'votes_user_event_unique'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Votes', 'votes_user_event_unique');
    await queryInterface.dropTable('Votes');
  }
};
