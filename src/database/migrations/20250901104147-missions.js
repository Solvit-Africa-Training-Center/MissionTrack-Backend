'use strict';

const { DataTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("missions",{
      id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey:true,
        allowNull:false
      },
    title:{
      type:Sequelize.STRING,
      allowNull:false
    },
    description:{
      type:Sequelize.TEXT,
      allowNull:false
    },
      location:{
        type:Sequelize.STRING,
        allowNull:false
      },
      jobPosition:{
        type:Sequelize.STRING,
        allowNull:false
      },
      status:{
        type:Sequelize.STRING,
        allowNull:false
      },
      createdAt:{
        type:Sequelize.DATE,
        defaultValue:DataTypes.NOW,
      },
      updatedAt:{
        type:Sequelize.DATE,
        defaultValue:DataTypes.NOW,
      },
      deletedAt:{
        type:Sequelize.DATE,
        allowNull:true,
        defaultValue:null
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("missions");
  }
};
