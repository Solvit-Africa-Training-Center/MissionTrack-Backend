const dotenv = require('dotenv');
dotenv.config();

const getPrefix = () => {
  let env = process.env.NODE_ENV;
  console.log('🔍 NODE_ENV:', env);
  if (!env) {
    env = 'DEV';
  }
  console.log('🔍 Using prefix:', env.toUpperCase());
  return env.toUpperCase();
};

const databaseConfig = () => {
  const env = getPrefix();
  
  // Debug: Log the specific variables we're looking for
  console.log('🔍 Looking for these environment variables:');
  console.log(`${env}_USERNAME: ${process.env[`${env}_USERNAME`]}`);
  console.log(`${env}_DATABASE: ${process.env[`${env}_DATABASE`]}`);
  console.log(`${env}_PASSWORD: ${process.env[`${env}_PASSWORD`] ? '[EXISTS]' : '[MISSING]'}`);
  console.log(`${env}_HOST: ${process.env[`${env}_HOST`]}`);
  console.log(`${env}_PORT: ${process.env[`${env}_PORT`]}`);

  const config = {
    username: process.env[`${env}_USERNAME`],
    database: process.env[`${env}_DATABASE`],
    password: process.env[`${env}_PASSWORD`],
    host: process.env[`${env}_HOST`],
    port: parseInt(process.env[`${env}_PORT`]) || 5432,
    dialect: 'postgres',
  };

  console.log('🔍 Final database config:');
  console.log(`Username: ${config.username}`);
  console.log(`Database: ${config.database}`);
  console.log(`Password: ${config.password ? '[EXISTS]' : '[MISSING]'}`);
  console.log(`Host: ${config.host}`);
  console.log(`Port: ${config.port}`);

  return config;
};

module.exports = databaseConfig;