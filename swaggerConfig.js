const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'BORCELLE API',
        version: '1.0.0',
        description: 'Documentación de la API de Borcelle para la gestión de pasteles y usuarios',
    },
    servers: [
        {
            url: 'http://localhost:3001',
            description: 'Servidor local',
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
    security: [{
        bearerAuth: []
    }],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/auth.js', './public/pasteles.js', './server.js'],  // Asegúrate de incluir todas las rutas de los controladores
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
