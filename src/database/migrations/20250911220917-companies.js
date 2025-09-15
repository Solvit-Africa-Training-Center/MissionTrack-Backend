'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('companies',{
      id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true
      },
      companyName:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      companyEmail:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
      },
    
      companyContact:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      province:{
        type:Sequelize.STRING,
        allowNull:false
      },
      district:{
        type:Sequelize.STRING,
        allowNull:false
      },
      sector:{
        type:Sequelize.STRING,
        allowNull:false
      },
        proofDocument:{
        type:Sequelize.STRING,
        allowNull:false
      },
      state:{
        type:Sequelize.ENUM('active','inactive'),
        allowNull:false,
        defaultValue:"active"
      },
      blockUnblockComment:{
        type:Sequelize.TEXT,
        allowNull:true
      },
        status:{
        type:Sequelize.ENUM('pending','approved','rejected'),
        allowNull:false,
        defaultValue:'pending'
      },
      approveComment:{
        type:Sequelize.STRING,
        allowNull:true
      },
    createdAt:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW
      },
      updatedAt:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW
      },
      deletedAt:{
        type:Sequelize.DATE,
        allowNull:true,
        defaultValue:null
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('companies')
  }
};
