'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("missions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      userId:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'users',
          key:'id'
        }
      },
      companyId:{
        type:Sequelize.STRING,
        allowNull:false
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jobPosition: {
        type: Sequelize.STRING,
        allowNull: false
      },
      missionTitle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      missionDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accommodationAmount:{
        type:Sequelize.FLOAT,
        allowNull:true,
        defaultValue:0
      },
      transportAmount:{
        type:Sequelize.FLOAT,
        allowNull:true,
        defaultValue:0
      },
      dailyAllowanceAmount:{
        type: Sequelize.FLOAT,
        allowNull:true,
        defaultValue:0
      },
      totalAmount:{
        type:Sequelize.FLOAT,
        allowNull:true,
        defaultValue:0
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("missions");
  }
};
