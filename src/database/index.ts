import { Sequelize } from "sequelize";

// Environment detection
const nodeEnv = process.env.ENV || "DEV";
const env = nodeEnv.toUpperCase();

console.log(`Current environment: ${env}`);

let sequelize: Sequelize;

if (env === "PROD" && process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging:  false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize({
    username: process.env[`${env}_USERNAME`],
    password: process.env[`${env}_PASSWORD`],
    database: process.env[`${env}_DATABASE`],
    host: process.env[`${env}_HOST`],
    port: parseInt(process.env[`${env}_PORT`] || "5432"),
    dialect: "postgres",
    logging: env === "DEV" ? console.log : false,
  });
}

// Initialize models
import { User } from "./models/users";
const models = { User };

// Associations
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export const database = {
  ...models,
  sequelize,
};
export { sequelize };
