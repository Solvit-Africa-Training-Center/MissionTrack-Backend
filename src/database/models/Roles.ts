import { Sequelize, Model, DataTypes } from "sequelize";

interface RoleAttribute {
  id: string;
  name: "Employee" | "Manager" | "Finance" | "Admin";
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface RoleCreationAttribute
  extends Omit<RoleAttribute, "id" | "deletedAt" | "createdAt" | "updatedAt"> {
  id?: string;
  deletedAt?: null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Role
  extends Model<RoleAttribute, RoleCreationAttribute>
  implements RoleAttribute
{
  public id!: string;
  public name!: "Employee" | "Manager" | "Finance" | "Admin";
  public description?: string;
  public permissions!: string[];
  public isActive!: boolean;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt: null = null;

  // Helper method to check if role has specific permission
  public hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  // Helper method to check if role has any of the given permissions
  public hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.permissions.includes(permission));
  }

  // Helper method to check if role has all of the given permissions
  public hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.permissions.includes(permission));
  }

  static associate(models: any): void {
    // Role has many Users
    Role.hasMany(models.User, { foreignKey: "roleId", as: "users" });
  }
}

// Sequelize model initializer
export const RoleModel = (sequelize: Sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.ENUM("Employee", "Manager", "Finance", "Admin"),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      permissions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        get() {
          const rawValue = this.getDataValue('permissions');
          return Array.isArray(rawValue) ? rawValue : [];
        },
        set(value: string[]) {
          this.setDataValue('permissions', Array.isArray(value) ? value : []);
        },
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
      modelName: "Roles",
      tableName: "roles",
    }
  );
  return Role;
};
