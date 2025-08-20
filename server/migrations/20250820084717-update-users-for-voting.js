'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add email field
    await queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    });

    // Add faculty field
    await queryInterface.addColumn('Users', 'faculty', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Add is_verified field for voting eligibility
    await queryInterface.addColumn('Users', 'is_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'email');
    await queryInterface.removeColumn('Users', 'faculty');
    await queryInterface.removeColumn('Users', 'is_verified');
  }
};
