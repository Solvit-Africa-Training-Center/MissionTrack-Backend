import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';
import YAML from 'yamljs';

// Load YAML files
const userPaths = YAML.load(path.join(__dirname, 'paths/users.yaml'));
const authPaths = YAML.load(path.join(__dirname, 'paths/auth.yaml'));
const userSchemas = YAML.load(path.join(__dirname, 'schemas/user.yaml'));
const commonSchemas = YAML.load(path.join(__dirname, 'schemas/common.yaml'));

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Mission Request System API',
      version: '1.0.0',
      description: 'API documentation for the Smart Mission Request System',
      contact: {
        name: 'API Support',
        email: 'support@smartmission.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5500',
        description: 'Development server',
      },
      {
        url: 'https://api.smartmission.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ...userSchemas.components.schemas,
        ...commonSchemas.components.schemas,
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    paths: {
      ...userPaths.paths,
      ...authPaths.paths,
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [], // We're not using JSDoc comments, so this can be empty
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📖 Docs available at http://localhost:${port}/api-docs`);
}

export default swaggerDocs;