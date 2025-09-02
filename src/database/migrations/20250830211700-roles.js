'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Make sure uuid-ossp extension is enabled for UUID generation
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'), // Use PostgreSQL UUID function
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.ENUM('Employee', 'Manager', 'Finance', 'Admin'),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      permissions: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of permission strings for this role',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Indexes
    await queryInterface.addIndex('roles', ['name'], {
      unique: true,
      name: 'roles_name_unique',
    });

    await queryInterface.addIndex('roles', ['isActive'], {
      name: 'roles_isActive_index',
    });

    // Insert default roles
    await queryInterface.bulkInsert('roles', [
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        name: 'Employee',
        description: 'Basic employee role with limited permissions',
        permissions: JSON.stringify([
          'create_mission',
          'view_own_missions',
          'update_own_profile',
          'submit_expenses',
        ]),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        name: 'Manager',
        description: 'Manager role with team management permissions',
        permissions: JSON.stringify([
          'create_mission',
          'view_own_missions',
          'view_team_missions',
          'approve_missions',
          'update_own_profile',
          'submit_expenses',
          'manage_team',
        ]),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        name: 'Finance',
        description: 'Finance role with financial approval permissions',
        permissions: JSON.stringify([
          'view_all_missions',
          'approve_financial_requests',
          'generate_reports',
          'update_own_profile',
          'manage_budgets',
        ]),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        name: 'Admin',
        description: 'Administrator role with full system access',
        permissions: JSON.stringify([
          'create_user',
          'manage_users',
          'view_all_missions',
          'approve_missions',
          'approve_financial_requests',
          'generate_reports',
          'system_configuration',
          'manage_roles',
          'audit_logs',
        ]),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Drop ENUM type first before dropping table
    await queryInterface.dropTable('roles');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_roles_name";');
  },
};
