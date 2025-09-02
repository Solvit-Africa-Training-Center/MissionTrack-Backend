import { Sequelize, Model, DataTypes } from "sequelize";

interface UserAttribute {
  id: string;
  roleId: string; // Add this line
  fullName: string;
  email: string;
  password: string;
  role: "Employee" | "Manager" | "Finance" | "Admin";
  department?: string;
  phone?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface UserCreationAttribute
  extends Omit<UserAttribute, "id" | "deletedAt" | "createdAt" | "updatedAt"> {
  id?: string;
  roleId: string; // Add this line - required for creation
  deletedAt?: null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User
  extends Model<UserAttribute, UserCreationAttribute>
  implements UserAttribute
{
  public id!: string;
  public roleId!: string; // Add this line
  public fullName!: string;
  public email!: string;
  public password!: string;
  public role!: "Employee" | "Manager" | "Finance" | "Admin";
  public department?: string;
  public phone?: string;
  public isActive!: boolean;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt: null = null;

  // Hide password in API responses
  public toJSON(): object | UserAttribute {
    return {
      id: this.id,
      roleId: this.roleId, // Add this line
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      department: this.department,
      phone: this.phone,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static associate(models: any): void {
    // User belongs to a Role
    User.belongsTo(models.Role, { foreignKey: "roleId", as: "roleDetails" });
    
    // Example associations for later:
    // User.hasMany(models.Mission, { foreignKey: "createdBy", as: "missions" });
    // User.hasMany(models.Expense, { foreignKey: "userId", as: "expenses" });
    // User.hasMany(models.Approval, { foreignKey: "approverId", as: "approvals" });
  }
}

// Sequelize model initializer
export const UserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      roleId: { // Add this field definition
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Employee", "Manager", "Finance", "Admin"),
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      paranoid: true, // enables deletedAt
      modelName: "Users",
      tableName: "users",
    }
  );
  return User;
};