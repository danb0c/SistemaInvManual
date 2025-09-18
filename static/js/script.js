// Variables globales para almacenar productos, tipos y supermercados
let productos = [];
let tiposProductos = []; // Tipos cargados desde la DB
// Lista de supermercados predefinidos
const supermercados = [
    "La Gran Feria El Cruce",
    "METRO MAX",
    "Coomersa",
    "La Gran Feria El Puerto"
];

// Lista de tipos de producto sugeridos para autocompletado y filtro
const suggestedProductTypes = [
    "Leche",
    "Lácteo",
    "Yogurt",
    "Bonyurt",
    "Queso",
    "Mantequilla",
    "Bebida", // No láctea
    "Arequipe"
];

// NUEVO: Lista de nombres de productos sugeridos para autocompletado
const suggestedProductNames = [
    "Leche Entera Alpina (Caja 1L)",
    "Arequipe Alpina (220g)",
    "Compota Alpina Baby Gü Vaso (113g)",
    "Alpinito Alpina x4 Und vaso (45g)",
    "Alpinito Alpina x4 Und vaso (90g)",
    "Alpinito Mora Alpina x4 Und vaso (45g)",
    "Alpinito Fresa Alpina x4 Und vaso (45g)",
    "Alpinito Melocotón Alpina x4 Und vaso (45g)",
    "Alpinito Mora Alpina x4 Und vaso (90g)",
    "Alpinito Fresa Alpina x4 Und vaso (90g)",
    "Alpinito Melocotón Alpina x4 Und vaso (90g)",
    "Alpinito MaxFrutos Alpina Rojos x4 Und Vaso (90g)",
    "Leche Deslactosada Alpina Caja (1L)",
    "Leche Descremada Alpina (Caja 1L)",
    "Yogurt Griego Natural Alpina (150g)",
    "Bonyurt Alpina (200g)",
    "Yogo Yogo Maxilitro Mora (1L)",
    "Yogo Yogo Maxilitro Fresa (1L)",
    "Yogo Yogo Maxilitro Melocotón (1L)",
    "Yogo Yogo Bolsa Und x6 (150g)",
    "Yogo Yogo Bolsa Und (150g)",
    "Yogo Yogo Cereal Vaso (130g)",
    "Yogurt Alpina Original Mora (1L)",
    "Yogurt Alpina Original Fresa (1L)",
    "Yogurt Alpina Original Melocotón (1L)",
    "Yogurt Alpina Original Vaso (150g)",
    "Yogurt Alpina Original Vaso (200g)",
    "Yogurt Alpina Finesse (1L)",
    "Yogurt Alpina Finesse vaso (150g)",
    "Yogurt Alpina Finesse Vaso (180g)",
    "Yox Defensis Alpina (100g)",
    "Regeneris Alpina (150g)",
    "Avena Alpina Original Vaso (250ml)",
    "Kumis Alpina (1L)",
    "Kumis Original Vaso (150g)",
    "Kumis Original Vaso (200g)",
    "Kumis Original Bolsa (150g)",
    "Kumis Alpina x6 Und Bolsa (150g)",
    "Alpinette Alpina (140g)",
    "Avena Finesse Vaso (250g)",
    "Queso Campesino Alpina (250g)",
    "Queso Finesse Alpina (300g)",
    "Queso Doble Crema Alpina (250g)",
    "Queso Mozzarella Alpina x15 (240g)",
    "Mini Bon Yurt Gomitas Trolli (108g)",
    "Mini Bon Yurt Choco Candy (100g)",
    "Yogurt Alpina Baby Gü Vainilla Vaso (113g)",
    "Queso Finesse 15 Tajadas (239g)",
    "Mantequilla Con Sal Alpina (125g)",
    "Mantequilla Sin Sal Alpina (125g)",
    "Avena Original Alpina x6 Und Bolsa (200g)",
    "Avena Original Alpina Und Bolsa (200g)",
    "Yogo Yogo Vaso (150g)",
    "Yogo Premio Botella (150g)",
    "Gelatina Boggy Fresa Vaso Alpina (108g)",
    "Gelatina Boggy Mora Vaso Alpina (108g)",
    "Gelatina Boggy Cereza Vaso Alpina (108g)",
    "Flan Vainilla Alpina (120g)",
    "Nectar Frutto Alpina Caja (200ml)",
    "Nectar Frutto Alpina Botella (300ml)",
    "Gelatina Boggy Alpina (108g)",
    "Alpin Chocolate Alpina Botella (300ml)",
    "Alpin Chocolate Caja (200ml)",
    "Alpin Chocolate Bolsa (180ml)",
    "Alpin Chocolate x6 Und Bolsa (180ml)",
    "Gelatina Boggy Premio Vaso Alpina (108g)",
    "Avena Finesse Botella (280ml)",
    "Avena Alpina Original en botella de (280g)",
    "Soka Alpina Botella (410ml)",
    "Soka Alpina Caja (200ml)",
    "Yogo Yogo en Caja (185g)",
    "Avena Deslactosada Alpina Vaso (250g)",
    "Avena Canela Alpina Vaso (250g)",
    "Bonyurt Alpina buuumbastico (170g)",
    "Queso Mozarella Alpina Bloque (250g)",
    "Yogo Yogo Cuchareable Fresa (100g)",
    "Yogurt Finesse Fresa Botella (1000ml)",
    "Yogurt Original Fresa Botella (1000ml)",
    "Avena Original Alpina Caja (1000g)",
    "Cremosino Alpina Vaso (200g)",
    "Cremosino Alpina Vaso (380g)",
    "Quesito Alpina Vaso (185g)",
    "Queso Mozarella Alpina 15 Tajadas (240g)",
    "Queso Parmesano Rallado Alpina (250g)",
    "Queso Parmesano Rallado Alpina (100g)",
    "Queso Parmesano Rallado Alpina (40g)",
    "Arequipe Alpina (500g)"
    
];


// --- Inicialización de la aplicación ---
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos y tipos al iniciar la página
    cargarProductos();
    cargarTiposProductos(); // Esta función ahora también usará los tipos sugeridos
    // cargarNombresProductos() se llamará dentro de cargarProductos() para asegurar que 'productos' esté lleno
    // Poblar los datalists y selects de supermercados al inicio
    actualizarDatalistSupermercados();
    actualizarSelectSupermercados();
    // Configurar los escuchadores de eventos para formularios y filtros
    setupEventListeners();
});

// --- Configuración de Event Listeners ---
function setupEventListeners() {
    // Formulario de agregar producto
    document.getElementById('productoForm').addEventListener('submit', agregarProducto);
    // Formulario de edición en el modal
    document.getElementById('editForm').addEventListener('submit', guardarEdicion);

    // Formulario de filtros (ahora se envía con un botón "Buscar")
    document.getElementById('filterForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío tradicional del formulario
        cargarProductos(); // Cargar productos con los filtros aplicados
    });

    // Modal de edición
    document.getElementsByClassName('close')[0].addEventListener('click', cerrarModal);
    // Cerrar modal si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('editModal')) {
            cerrarModal();
        }
    });
}

// --- Funciones para cargar datos del backend (API) ---

async function cargarProductos() {
    try {
        const url = new URL('/api/productos', window.location.origin);
        // Obtener valores de los filtros para enviarlos al backend
        const tipoFiltro = document.getElementById('filtroTipo').value;
        const busqueda = document.getElementById('busqueda').value;
        const diasExpiracion = document.getElementById('diasExpiracion').value;
        const supermercadoFiltro = document.getElementById('filtroSupermercado').value; // Nuevo filtro

        if (tipoFiltro) url.searchParams.append('tipo', tipoFiltro);
        if (busqueda) url.searchParams.append('busqueda', busqueda);
        if (diasExpiracion) url.searchParams.append('dias_expiracion', diasExpiracion);
        if (supermercadoFiltro) url.searchParams.append('supermercado', supermercadoFiltro); // Añadir al URL

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        productos = await response.json();
        mostrarProductos(productos); // Actualizar la tabla
        actualizarEstadisticas(); // Actualizar las tarjetas de estadísticas
        cargarNombresProductos(); // <-- Llamada aquí para actualizar sugerencias de nombres después de cargar productos
    } catch (error) {
        mostrarAlerta('Error al cargar productos: ' + error.message, 'error');
        console.error('Error al cargar productos:', error);
    }
}

async function cargarTiposProductos() {
    try {
        const response = await fetch('/api/tipos-productos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dbTypes = await response.json();
        // Combinar tipos de la DB con tipos sugeridos y eliminar duplicados
        tiposProductos = [...new Set([...dbTypes, ...suggestedProductTypes])].sort();
        
        actualizarSelectTipos(); // Actualizar el select de filtro
        actualizarDatalistTipos(); // Actualizar el datalist para el formulario de agregar
    } catch (error) {
        console.error('Error al cargar tipos de productos:', error);
    }
}

// NUEVA FUNCIÓN: Cargar y actualizar los nombres de productos para el datalist
async function cargarNombresProductos() {
    try {
        // Obtener nombres únicos de los productos actualmente cargados en la tabla
        const dbNames = [...new Set(productos.map(p => p.nombre))];
        // Combinar nombres de la DB con los nombres sugeridos y eliminar duplicados, luego ordenar
        nombresProductos = [...new Set([...dbNames, ...suggestedProductNames])].sort();
        
        actualizarDatalistNombresProductos(); // Actualizar los datalists en el HTML
    } catch (error) {
        console.error('Error al cargar nombres de productos:', error);
    }
}


// --- Funciones para actualizar la interfaz de usuario (UI) ---

function actualizarSelectTipos() {
    const select = document.getElementById('filtroTipo');
    // Limpiar opciones existentes, excepto la primera "Todos los tipos"
    select.innerHTML = '<option value="">Todos los tipos</option>';
    tiposProductos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });
}

function actualizarDatalistTipos() {
    const datalist = document.getElementById('tiposProductos');
    datalist.innerHTML = ''; // Limpiar datalist
    tiposProductos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        datalist.appendChild(option);
    });
}

// NUEVA FUNCIÓN: Actualizar datalists para nombres de productos
function actualizarDatalistNombresProductos() {
    const datalistAdd = document.getElementById('nombresProductosList');
    const datalistEdit = document.getElementById('nombresProductosListEdit');
    
    datalistAdd.innerHTML = '';
    datalistEdit.innerHTML = '';

    nombresProductos.forEach(nombre => {
        const optionAdd = document.createElement('option');
        optionAdd.value = nombre;
        datalistAdd.appendChild(optionAdd);

        const optionEdit = document.createElement('option');
        optionEdit.value = nombre;
        datalistEdit.appendChild(optionEdit);
    });
}

function actualizarDatalistSupermercados() {
    const datalistAdd = document.getElementById('supermercadosList');
    const datalistEdit = document.getElementById('supermercadosListEdit');
    
    datalistAdd.innerHTML = '';
    datalistEdit.innerHTML = '';

    supermercados.forEach(supermercado => {
        const optionAdd = document.createElement('option');
        optionAdd.value = supermercado;
        datalistAdd.appendChild(optionAdd);

        const optionEdit = document.createElement('option');
        optionEdit.value = supermercado;
        datalistEdit.appendChild(optionEdit);
    });
}

function actualizarSelectSupermercados() {
    const select = document.getElementById('filtroSupermercado');
    select.innerHTML = '<option value="">Todos los supermercados</option>';
    supermercados.forEach(supermercado => {
        const option = document.createElement('option');
        option.value = supermercado;
        option.textContent = supermercado;
        select.appendChild(option);
    });
}

function mostrarProductos(productos) {
    const tbody = document.getElementById('productosBody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de renderizar

    if (productos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state"> <!-- Colspan ajustado -->
                    <h3>No hay productos en el inventario que coincidan.</h3>
                    <p>Intente ajustar sus filtros o agregue nuevos productos.</p>
                </td>
            </tr>
        `;
        return;
    }

    productos.forEach(producto => {
        const row = document.createElement('tr');
        // Asignar clase CSS basada en el estado de expiración (viene del backend)
        row.classList.add(`estado-${producto.estado_expiracion}`);

        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.tipo}</td>
            <td>${producto.cantidad}</td>
            <td>${formatearFecha(producto.fecha_expedicion)}</td>
            <td>${producto.supermercado}</td>
            <td>
                <span class="estado-badge badge-${producto.estado_expiracion}">
                    ${producto.estado_expiracion === 'expirado' ? '🚫 Expirado' :
                      producto.estado_expiracion === 'proximo_expiracion' ? '⚠️ Próximo' : '✅ Vigente'}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="btn btn-warning" onclick="editarProducto(${producto.id})">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="confirmarEliminar(${producto.id}, '${producto.nombre}')">🗑️ Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function formatearFecha(fecha) {
    // Asegurarse de que la fecha sea un objeto Date válido
    const fechaObj = new Date(fecha + 'T00:00:00'); // Añadir T00:00:00 para evitar problemas de zona horaria
    if (isNaN(fechaObj.getTime())) {
        return fecha; // Devolver la fecha original si es inválida
    }
    return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function actualizarEstadisticas() {
    const total = productos.length;
    const expirados = productos.filter(p => p.estado_expiracion === 'expirado').length;
    const proximos = productos.filter(p => p.estado_expiracion === 'proximo_expiracion').length;
    const vigentes = productos.filter(p => p.estado_expiracion === 'vigente').length;

    document.getElementById('totalProductos').textContent = total;
    document.getElementById('productosExpirados').textContent = expirados;
    document.getElementById('productosProximos').textContent = proximos;
    document.getElementById('productosVigentes').textContent = vigentes;
}

// --- Funciones de Formulario y CRUD (interacción con la API) ---

async function agregarProducto(event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    const form = event.target;
    const producto = {
        nombre: form.nombre.value,
        tipo: form.tipo.value,
        cantidad: parseInt(form.cantidad.value),
        fecha_expedicion: form.fechaExpedicion.value,
        supermercado: form.supermercado.value
    };

    try {
        const response = await fetch('/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        const result = await response.json();

        if (response.ok) {
            mostrarAlerta(result.mensaje, 'success');
            form.reset(); // Limpiar el formulario
            cargarProductos(); // Recargar la tabla de productos (esto también actualizará los nombres)
            cargarTiposProductos(); // Recargar los tipos para el datalist/select
        } else {
            mostrarAlerta('Error al agregar: ' + result.error, 'error');
        }
    } catch (error) {
        mostrarAlerta('Error de conexión al agregar producto: ' + error.message, 'error');
        console.error('Error en agregarProducto:', error);
    }
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        mostrarAlerta('Producto no encontrado para editar.', 'error');
        return;
    }

    // Rellenar el modal con los datos del producto
    document.getElementById('editId').value = producto.id;
    document.getElementById('editNombre').value = producto.nombre;
    document.getElementById('editTipo').value = producto.tipo;
    document.getElementById('editCantidad').value = producto.cantidad;
    document.getElementById('editFechaExpedicion').value = producto.fecha_expedicion;
    document.getElementById('editSupermercado').value = producto.supermercado;

    abrirModal(); // Mostrar el modal
}

async function guardarEdicion(event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    const id = document.getElementById('editId').value;
    const productoActualizado = {
        nombre: document.getElementById('editNombre').value,
        tipo: document.getElementById('editTipo').value,
        cantidad: parseInt(document.getElementById('editCantidad').value),
        fecha_expedicion: document.getElementById('editFechaExpedicion').value,
        supermercado: document.getElementById('editSupermercado').value
    };

    try {
        const response = await fetch(`/api/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoActualizado)
        });

        const result = await response.json();

        if (response.ok) {
            mostrarAlerta(result.mensaje, 'success');
            cerrarModal(); // Cerrar el modal después de guardar
            cargarProductos(); // Recargar la tabla de productos (esto también actualizará los nombres)
            cargarTiposProductos(); // Recargar los tipos
        } else {
            mostrarAlerta('Error al actualizar: ' + result.error, 'error');
        }
    } catch (error) {
        mostrarAlerta('Error de conexión al actualizar producto: ' + error.message, 'error');
        console.error('Error en guardarEdicion:', error);
    }
}

function confirmarEliminar(id, nombreProducto) {
    if (confirm(`¿Estás seguro de eliminar el producto "${nombreProducto}"? Esta acción es irreversible.`)) {
        eliminarProducto(id);
    }
}

async function eliminarProducto(id) {
    try {
        const response = await fetch(`/api/productos/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            mostrarAlerta(result.mensaje, 'success');
            cargarProductos(); // Recargar la tabla de productos (esto también actualizará los nombres)
            cargarTiposProductos(); // Recargar los tipos
        } else {
            mostrarAlerta('Error al eliminar: ' + result.error, 'error');
        }
    } catch (error) {
        mostrarAlerta('Error de conexión al eliminar producto: ' + error.message, 'error');
        console.error('Error en eliminarProducto:', error);
    }
}

// --- Funciones de Filtros ---

function limpiarFiltros() {
    document.getElementById('filtroTipo').value = '';
    document.getElementById('busqueda').value = '';
    document.getElementById('diasExpiracion').value = '';
    document.getElementById('filtroSupermercado').value = '';
    cargarProductos(); // Recargar productos sin filtros
}

// --- Funciones de Alertas y Modal ---

function mostrarAlerta(mensaje, tipo) {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.textContent = mensaje;
    alertContainer.appendChild(alertDiv);

    // Eliminar la alerta después de 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function abrirModal() {
    document.getElementById('editModal').style.display = 'flex'; // Usar flex para centrar
}

function cerrarModal() {
    document.getElementById('editModal').style.display = 'none';
}