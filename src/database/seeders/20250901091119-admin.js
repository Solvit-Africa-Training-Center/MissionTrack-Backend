'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    // Get the UUID of the 'Admin' role from roles table
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Admin' LIMIT 1;`
    );
    const adminRoleId = roles[0].id;

    // Insert Admin user
    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      roleId: adminRoleId, // use the UUID here
      fullName: 'System Admin',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'Admin',
      department: 'Administration',
      phone: '+250780515055',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@company.com' }, {});
  }
};
