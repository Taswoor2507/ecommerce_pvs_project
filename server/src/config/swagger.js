import swaggerJsdoc from 'swagger-jsdoc';
import { CONSTANTS } from './constants.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce PVS API',
      version: '1.0.0',
      description: 'API Documentation for the E-Commerce Product Variants System (PVS)',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${CONSTANTS.PORT || 5000}`,
        description: 'Local server',
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/docs/*.swagger.js'], // Separation of concerns: documentation files only
};

export const swaggerSpec = swaggerJsdoc(options);
