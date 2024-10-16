// Ruta al archivo JSON local 
const JSON_URL = 'pasteles.json'; 

/**
 * @swagger
 * components:
 *   schemas:
 *     Pastel:
 *       type: object
 *       properties:
 *         Nombre:
 *           type: string
 *           description: El nombre del pastel
 *         sabor:
 *           type: string
 *           description: El sabor del pastel
 *         tamano:
 *           type: string
 *           description: El tamaño del pastel
 *         capas:
 *           type: number
 *           description: El número de capas del pastel
 *         decoracion:
 *           type: object
 *           properties:
 *             tipo:
 *               type: string
 *               description: El tipo de decoración
 *           description: Información de la decoración del pastel
 *         relleno:
 *           type: string
 *           description: El relleno del pastel
 *       required:
 *         - Nombre
 *         - sabor
 *         - tamano
 *         - capas
 *         - decoracion
 *         - relleno
 */

/**
 * @swagger
 * /pasteles:
 *   get:
 *     summary: Obtiene el catálogo de pasteles
 *     tags: [Pasteles]
 *     description: Devuelve una lista de todos los pasteles disponibles en el archivo JSON.
 *     responses:
 *       200:
 *         description: Lista de pasteles obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pastel'
 *       500:
 *         description: Error al cargar el archivo JSON
 */


// Contenedor del catálogo
const catalogContainer = document.querySelector('.catalog-container');


// Función para obtener los datos del JSON
async function obtenerPasteles() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        const pasteles = await response.json();
        renderizarCatalogo(pasteles);  // Renderizamos todos los pasteles
        return pasteles;  // Devolvemos los pasteles para uso futuro
    } catch (error) {
        console.error('Error al obtener los pasteles:', error);
    }
}

// Función para renderizar los pasteles en el catálogo
function renderizarCatalogo(pasteles) {
    catalogContainer.innerHTML = '';  // Limpiar contenido previo

    pasteles.forEach((pastel, index) => {
        const itemHTML = `
            <div class="catalog-item" id="pastel-${index}">
                <img src="${pastel.imagen}" alt="${pastel.Nombre}">
                <div class="catalog-info">
                    <h3>${pastel.Nombre}</h3>
                    <div class="detalles" style="display: none;">  <!-- Detalles ocultos inicialmente -->
                        <p><strong>Sabor:</strong> ${pastel.sabor}</p>
                        <p><strong>Tamaño:</strong> ${pastel.tamano}</p>
                        <p><strong>Capas:</strong> ${pastel.capas}</p>
                        <p><strong>Decoración:</strong> ${pastel.decoracion.tipo}</p>
                        <p><strong>Relleno:</strong> ${pastel.relleno}</p>
                    </div>
                    <button onclick="verMas(${index})">Ver más</button>
                </div>
            </div>
        `;
        catalogContainer.innerHTML += itemHTML;  // Agregamos cada pastel
    });
}

// Función para mostrar los detalles del pastel cuando se hace clic en "Ver más"
function verMas(index) {
    const pastelElement = document.querySelector(`#pastel-${index} .detalles`);
    const boton = document.querySelector(`#pastel-${index} button`);

    if (pastelElement.style.display === 'none') {
        pastelElement.style.display = 'block';  // Mostrar los detalles
        boton.textContent = 'Ver menos';  // Cambiar el texto del botón
    } else {
        pastelElement.style.display = 'none';  // Ocultar los detalles
        boton.textContent = 'Ver más';  // Cambiar el texto del botón
    }
}

// Función para filtrar los pasteles por categoría
async function filtrarPorCategoria(categoria) {
    const pasteles = await obtenerPasteles();  // Obtener todos los pasteles
    const filtrados = categoria === 'Todos'
        ? pasteles  // Mostrar todos si la categoría es "Todos"
        : pasteles.filter(pastel => pastel.categoria.toLowerCase() === categoria.toLowerCase());

    renderizarCatalogo(filtrados);  // Renderizar los pasteles filtrados
}

// Llamada inicial para cargar todos los pasteles
obtenerPasteles();
