const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const router = express.Router();

/**
 * Lee los usuarios desde el archivo users.json
 */
function readUsersFromFile() {
    try {
        const data = fs.readFileSync('./users.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo de usuarios:', err);
        return [];  // Retorna un arreglo vacío si hay algún problema
    }
}

/**
 * Guarda los usuarios en el archivo users.json
 */
function writeUsersToFile(users) {
    try {
        fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error al escribir en el archivo de usuarios:', err);
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - username
 *         - password
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de nuevos usuarios
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: El correo ya está registrado
 */
router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    let users = readUsersFromFile();

    // Verificar si el usuario ya existe
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, username, password: hashedPassword };
    users.push(newUser);

    // Guardar el nuevo usuario en el archivo
    writeUsersToFile(users);
    res.status(201).json({ message: 'Usuario registrado con éxito' });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso y JWT generado
 *       400:
 *         description: Usuario no encontrado
 *       401:
 *         description: Contraseña incorrecta
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    let users = readUsersFromFile();

    // Buscar el usuario
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Crear el token JWT
        const token = jwt.sign({ email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    });
});

/**
 * @swagger
 * /auth/pasteles:
 *   get:
 *     summary: Obtener lista de pasteles
 *     tags: [Pasteles]
 *     responses:
 *       200:
 *         description: Retorna la lista de pasteles desde el archivo JSON
 *       500:
 *         description: Error al leer o procesar el archivo JSON
 */
router.get('/pasteles', (req, res) => {
    fs.readFile('./pasteles.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            return res.status(500).json({ message: 'Error al leer los datos' });
        }
        try {
            const pasteles = JSON.parse(data);
            res.status(200).json(pasteles);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            res.status(500).json({ message: 'Error al procesar los datos' });
        }
    });
});

module.exports = router;
