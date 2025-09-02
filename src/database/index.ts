import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DEV_HOST,
  username: process.env.DEV_USERNAME,
  password: process.env.DEV_PASSWORD,
  database: process.env.DEV_DATABASE,
  logging: false,
});

import { UserModel } from "./models/User";
import { RoleModel } from "./models/Roles";

// Initialize models with sequelize instance
const User = UserModel(sequelize);
const Role = RoleModel(sequelize);

// Set up associations
Role.associate({ User });
User.associate({ Role });

export const database = {
  User,
  Role,
  sequelize,
};
