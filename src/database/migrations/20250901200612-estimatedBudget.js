'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("estBudget", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      missionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references:{
          model:"missions",
          key:"id"
        }
      },
      estimatedAccommodationCost: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      estimatedMealCost: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      estimatedTransportCost: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      createdAt:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
      },
      updatedAt:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
      },
      deletedAt:{
        type:DataTypes.DATE,
        allowNull:true,
        defaultValue:null
      }

    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("estBudget");
  }
};
