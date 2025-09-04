import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

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
        url: "http://localhost:5000/api",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "User management operations"
      },
      {
        name: "Missions", 
        description: "Mission management operations"
      }
    ]
  },
  apis: ["./src/swagger/*.yaml", "./src/routes/*.ts"], 
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSpec;