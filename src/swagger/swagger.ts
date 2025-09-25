import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const serverUrl =
  process.env.ENV === "PROD"
    ? process.env.PROD_URL || "https://missiontrack-backend.onrender.com" 
    : "http://localhost:5000/api";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mission Management API",
      version: "1.0.0",
      description: "API documentation for Mission and User management operations",
    },
     servers: [
      {
        url:serverUrl,
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User Authentication operations",
      },
      {
        name: "Company",
        description: "Company management operations",
      },
      {
        name: "Users",
        description: "User management operations",
      },
      {
        name:"Missions",
        description:"Mission management operations",
      },
      {
        name: "Managers Mission Actions",
        description: "Mission management operations",
      },
  
      {
        name: "Daily Reports",
        description: "Daily Report management operations",
      },
      {
        name: "Expense Logs",
        description: "Expense tracking operations",
      },
    ],
  },
  apis: ["./src/swagger/*.yaml", "./src/routes/*.ts"], 
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSpec;