'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(), 
        companyId: "da85a655-2b7c-4ca4-a20a-5cdec5e5485b", 
        fullName: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        department: 'IT',
        phoneNumber: '+250789123456',
        is_active: true,
        resetToken:null,
        resetTokenExpiry:null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
