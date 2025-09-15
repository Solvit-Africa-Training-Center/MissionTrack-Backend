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
    await queryInterface.createTable('dailyReports',{
      id:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey:true,
        allowNull:false
      },
      userId:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'users',
          key:'id'
        }
      },
      missionId:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'missions',
          key:'id'
        }
      },
      date:{
        type:Sequelize.DATE,
        allowNull:false
      },
      dailyActivity:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      documents:{
        type:Sequelize.STRING,
        allowNull:true
      },
      filePath:{
        type:Sequelize.STRING,
        allowNull:true
      },
      description:{
        type:Sequelize.TEXT,
        allowNull:true
      },
      createdAt:{
        type:Sequelize.DATE,
        defaultValue:Sequelize.NOW,
      },
      updatedAt:{
        type:Sequelize.DATE,
        defaultValue:Sequelize.NOW,

      },
      deletedAt:{
        type:Sequelize.DATE,
        allowNull:true
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
    await queryInterface.dropTable('dailyReports');
  }
};
