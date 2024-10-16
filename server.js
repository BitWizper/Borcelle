const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

// Inicializa variables de entorno
dotenv.config();

// Configuración del servidor
const app = express();
const PORT = process.env.PORT || 3001;

// Habilitar CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

// Middleware para servir archivos estáticos (como el index.html)
app.use(express.static('public'));

// Configurar ruta de documentación de Swagger (esto debe ir después de la inicialización de `app`)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta para autenticación
app.use('/auth', authRoutes);

// Ruta para servir pasteles.json protegido por autenticación JWT
app.get('/pasteles', authenticateToken, (req, res) => {
    res.sendFile(__dirname + '/public/pasteles.json');  // Envía el archivo pasteles.json si el token es válido
});

// Ruta protegida de ejemplo
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Acceso permitido', user: req.user });
});

// Middleware de autenticación con JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
