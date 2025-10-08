"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("companies", [
      {
        id: uuidv4(), 
        companyName: "Tech Innovators Ltd",
        companyEmail: "info@techinnovators.com",
        proofDocument: "proof_doc_1.pdf",
        companyContact: "+250788000111",
        province: "Kigali",
        district: "Gasabo",
        sector: "Kimironko",
        state: "active",
        blockUnblockComment: null,
        status: "approved",
        approveComment: "Verified successfully",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: uuidv4(), // ✅ same here
        companyName: "Agro Growth Ltd",
        companyEmail: "contact@agrogrowth.com",
        proofDocument: "proof_doc_2.pdf",
        companyContact: "+250788000222",
        province: "Eastern",
        district: "Rwamagana",
        sector: "Karenge",
        state: "trial",
        blockUnblockComment: "Blocked due to inactivity",
        status: "pending",
        approveComment: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("companies", null, {});
  },
};
