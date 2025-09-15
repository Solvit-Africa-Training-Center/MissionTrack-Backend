"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
       id: "af4357d9-72a9-45d7-a288-4fcfbb59fc9a",
        fullName: "Admin User",
        email: "admin@example.com",
        password: "hashedpassword123",
        phoneNumber: "0788888888",
        department: "IT",
        role: "admin",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
       
       id: "af4357d9-72a9-45d7-a288-4fcfbb59fc9b",
        fullName: "Employee One",
        email: "employee1@example.com",
        password: "hashedpassword456",
        phoneNumber: "0722222222",
        department: "Finance",
        role: "employee",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
