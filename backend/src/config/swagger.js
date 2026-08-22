const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const config = require('./index');

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'StudentSathi API',
      version: '1.0.0',
      description:
        'Student guidance platform — Government Documents, Schemes & Scholarships.',
      contact: { name: 'StudentSathi', email: 'hello@studentsathi.in' },
      license: { name: 'MIT' },
    },
    servers: [
      { url: `http://localhost:${config.port}${config.apiPrefix}`, description: 'Local' },
      { url: `https://api.studentsathi.in${config.apiPrefix}`, description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../docs/*.yaml'),
  ],
});

module.exports = swaggerSpec;
