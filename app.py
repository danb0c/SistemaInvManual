from flask import Flask, render_template, request, jsonify # Eliminamos redirect, url_for ya no se usan en las APIs
import sqlite3
from datetime import datetime, timedelta
import os

app = Flask(__name__)

# Configuración de la base de datos
DATABASE = 'inventario.db' # Nombre del archivo de la base de datos

# --- Funciones de la Base de Datos ---

def init_db():
    """
    Inicializa la base de datos y crea la tabla de productos si no existe.
    Añade la columna 'supermercado' si no existe.
    """
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Crea la tabla productos si no existe
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            tipo TEXT NOT NULL,
            cantidad INTEGER NOT NULL,
            fecha_expedicion DATE NOT NULL,
            supermercado TEXT NOT NULL, -- Nuevo campo
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Opcional: Si ya tenías la tabla sin 'supermercado', puedes añadirla con ALTER TABLE
    # Esto es útil si ya habías ejecutado la app antes sin este campo.
    try:
        cursor.execute("ALTER TABLE productos ADD COLUMN supermercado TEXT DEFAULT 'Desconocido'")
        conn.commit()
        print("Columna 'supermercado' añadida a la tabla 'productos'.")
    except sqlite3.OperationalError as e:
        if "duplicate column name: supermercado" in str(e):
            print("La columna 'supermercado' ya existe.")
        else:
            print(f"Error al añadir columna 'supermercado': {e}")
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Obtiene una conexión a la base de datos con row_factory para acceder por nombre de columna."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Asegurarse de que la base de datos se inicialice al iniciar la aplicación
# Este bloque se ejecuta una vez cuando el script se inicia.
with app.app_context():
    init_db()

# --- Rutas de la Aplicación Web (para servir el HTML principal) ---

@app.route('/')
def index():
    """Sirve la página principal (index.html) de la aplicación."""
    # El HTML y JavaScript del frontend se encargarán de cargar los datos vía API.
    return render_template('index.html')

# --- API RESTful para Productos ---

@app.route('/api/productos', methods=['GET'])
def get_productos():
    """
    Obtiene todos los productos del inventario, aplicando filtros si se proporcionan.
    Devuelve los productos con su estado de expiración calculado.
    """
    conn = get_db_connection()
    
    # Parámetros de filtrado recibidos desde el frontend
    tipo_filtro = request.args.get('tipo', '')
    busqueda = request.args.get('busqueda', '')
    dias_expiracion_str = request.args.get('dias_expiracion', '')
    supermercado_filtro = request.args.get('supermercado', '') # Nuevo filtro
    
    query = '''
        SELECT id, nombre, tipo, cantidad, fecha_expedicion, supermercado, -- Incluir nuevo campo
               CASE 
                   WHEN date(fecha_expedicion) < date('now') THEN 'expirado'
                   WHEN date(fecha_expedicion) <= date('now', '+7 days') THEN 'proximo_expiracion' -- Próximos 7 días
                   ELSE 'vigente'
               END as estado_expiracion
        FROM productos
        WHERE 1=1
    '''
    
    params = []
    
    if tipo_filtro:
        query += ' AND tipo LIKE ?'
        params.append(f'%{tipo_filtro}%')
    
    if busqueda:
        query += ' AND nombre LIKE ?'
        params.append(f'%{busqueda}%')
    
    if supermercado_filtro: # Aplicar filtro por supermercado
        query += ' AND supermercado LIKE ?'
        params.append(f'%{supermercado_filtro}%')
    
    if dias_expiracion_str:
        try:
            dias = int(dias_expiracion_str)
            if dias < 0: dias = 0 # Asegurarse de que no sea negativo
            # Calcular la fecha límite para la expiración
            fecha_limite = (datetime.now() + timedelta(days=dias)).strftime('%Y-%m-%d')
            query += ' AND fecha_expedicion <= ? AND date(fecha_expedicion) >= date(\'now\')' # Solo productos futuros o de hoy
            params.append(fecha_limite)
        except ValueError:
            pass # Ignorar si dias_expiracion no es un número válido
    
    query += ' ORDER BY fecha_expedicion ASC' # Ordenar por fecha de expedición
    
    productos = conn.execute(query, params).fetchall()
    conn.close()
    
    # Convertir las filas de la base de datos a diccionarios para jsonify
    return jsonify([dict(producto) for producto in productos])

@app.route('/api/productos', methods=['POST'])
def crear_producto():
    """Crea un nuevo producto en la base de datos."""
    data = request.get_json()
    
    # Validar que todos los campos requeridos estén presentes
    required_fields = ['nombre', 'tipo', 'cantidad', 'fecha_expedicion', 'supermercado']
    if not all(key in data for key in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    try:
        # Validar formato de fecha (YYYY-MM-DD)
        datetime.strptime(data['fecha_expedicion'], '%Y-%m-%d')
        
        # Validar cantidad como número entero positivo
        cantidad = int(data['cantidad'])
        if cantidad < 0:
            return jsonify({'error': 'La cantidad debe ser positiva o cero'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO productos (nombre, tipo, cantidad, fecha_expedicion, supermercado)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['nombre'], data['tipo'], cantidad, data['fecha_expedicion'], data['supermercado']))
        
        conn.commit()
        producto_id = cursor.lastrowid # Obtener el ID del producto recién insertado
        conn.close()
        
        return jsonify({'id': producto_id, 'mensaje': 'Producto creado exitosamente'}), 201
        
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido o cantidad no numérica'}), 400
    except Exception as e:
        # Capturar cualquier otra excepción inesperada
        return jsonify({'error': str(e)}), 500

@app.route('/api/productos/<int:producto_id>', methods=['PUT'])
def actualizar_producto(producto_id):
    """Actualiza un producto existente por su ID."""
    data = request.get_json()
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar si el producto existe antes de intentar actualizar
        producto = cursor.execute('SELECT * FROM productos WHERE id = ?', (producto_id,)).fetchone()
        if not producto:
            return jsonify({'error': 'Producto no encontrado'}), 404
        
        # Construir la consulta de actualización dinámicamente
        campos_actualizacion = []
        valores = []
        
        if 'nombre' in data:
            campos_actualizacion.append('nombre = ?')
            valores.append(data['nombre'])
        
        if 'tipo' in data:
            campos_actualizacion.append('tipo = ?')
            valores.append(data['tipo'])
        
        if 'cantidad' in data:
            cantidad = int(data['cantidad'])
            if cantidad < 0:
                return jsonify({'error': 'La cantidad debe ser positiva o cero'}), 400
            campos_actualizacion.append('cantidad = ?')
            valores.append(cantidad)
        
        if 'fecha_expedicion' in data:
            datetime.strptime(data['fecha_expedicion'], '%Y-%m-%d') # Validar formato
            campos_actualizacion.append('fecha_expedicion = ?')
            valores.append(data['fecha_expedicion'])

        if 'supermercado' in data: # Nuevo campo para actualizar
            campos_actualizacion.append('supermercado = ?')
            valores.append(data['supermercado'])
        
        if campos_actualizacion:
            valores.append(producto_id) # El ID es el último valor para la cláusula WHERE
            query = f'UPDATE productos SET {", ".join(campos_actualizacion)} WHERE id = ?'
            cursor.execute(query, valores)
            conn.commit()
        else:
            # Si no se proporcionaron campos para actualizar, no es un error, solo no hay cambios
            return jsonify({'mensaje': 'No se proporcionaron campos para actualizar'}), 200

        conn.close()
        
        return jsonify({'mensaje': 'Producto actualizado exitosamente'})
        
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido o cantidad no numérica'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/productos/<int:producto_id>', methods=['DELETE'])
def eliminar_producto(producto_id):
    """Elimina un producto por su ID."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar si el producto existe antes de intentar eliminar
        producto = cursor.execute('SELECT * FROM productos WHERE id = ?', (producto_id,)).fetchone()
        if not producto:
            return jsonify({'error': 'Producto no encontrado'}), 404
        
        cursor.execute('DELETE FROM productos WHERE id = ?', (producto_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'mensaje': 'Producto eliminado exitosamente'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tipos-productos', methods=['GET'])
def get_tipos_productos():
    """Obtiene una lista de todos los tipos de productos únicos de la base de datos."""
    conn = get_db_connection()
    tipos = conn.execute('SELECT DISTINCT tipo FROM productos ORDER BY tipo').fetchall()
    conn.close()
    
    return jsonify([tipo['tipo'] for tipo in tipos])

# --- Ejecución de la aplicación ---
if __name__ == '__main__':
    # Crear directorio de templates si no existe (aunque Flask lo hace si usas render_template)
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    # Inicializar base de datos (crea la tabla y la columna si no existen)
    init_db()
    
    # Ejecutar la aplicación en modo depuración (recarga automática)
    # y accesible solo desde tu máquina (127.0.0.1) en el puerto 5000.
    app.run(debug=True, host='127.0.0.1', port=5000)
