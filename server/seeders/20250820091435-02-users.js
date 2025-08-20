'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash password: admin123
    const adminPassword = await bcrypt.hash('admin123', 5);
    // Hash password: user123 
    const userPassword = await bcrypt.hash('user123', 5);

    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Admin VoteSecure',
        NIK: 1111001,
        password: adminPassword,
        role_id: 1,
        email: 'admin@votesecure.com',
        faculty: 'IT Admin',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Test User 1',
        NIK: 2021001,
        password: userPassword,
        role_id: 2,
        email: 'user1@example.com',
        faculty: 'Teknik Informatika',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Test User 2',
        NIK: 2021002,
        password: userPassword,
        role_id: 2,
        email: 'user2@example.com',
        faculty: 'Ekonomi',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Test User 3',
        NIK: 2021003,
        password: userPassword,
        role_id: 2,
        email: 'user3@example.com',
        faculty: 'Teknik',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
