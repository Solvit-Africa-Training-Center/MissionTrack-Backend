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

    await queryInterface.createTable("missionActions",{
      id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey:true,
        allowNull:false
      },
      missionId:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:"missions",
          key:"id"
        }
      },
      actorId:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:"users",
          key:"id"
        }
      },
      action:{
        type:Sequelize.STRING,
        allowNull:false
      },
      comment:{
        type:Sequelize.TEXT,
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
    await queryInterface.dropTable("missionActions");
  }
};
