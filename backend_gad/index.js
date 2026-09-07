const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { z } = require('zod');

const app = express();

// Configuración amplia de CORS para que Chrome (Web) no bloquee las peticiones
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Conexión (Pool) para PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'evanguelion',
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("Error al conectar a PostgreSQL:", err.message);
    } else {
        console.log("Pool de conexiones a PostgreSQL creado exitosamente.");
        release();
    }
});

const loginSchema = z.object({
  usuario: z.string().min(1, { message: "El usuario es obligatorio" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" })
});

// 1. PANTALLA DE LOGIN EN EL NAVEGADOR (Web del servidor)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Login - Conecta GAD</title></head>
      <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #e0e0e0; margin: 0;">
        <div style="text-align: center; padding: 40px; border: 2px solid #333; border-radius: 8px; background: white; width: 380px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #007bff; margin-bottom: 5px;">Conecta GAD</h2>
          <p style="font-weight: bold; color: #555; font-size: 14px;">Acceso Privado - Gestión 2026</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <form action="/login-web" method="POST" style="text-align: left;">
            <label style="font-size: 13px; font-weight: bold;">Usuario:</label>
            <input type="text" name="usuario" required style="width: 100%; padding: 10px; margin: 5px 0 15px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            
            <label style="font-size: 13px; font-weight: bold;">Contraseña:</label>
            <input type="password" name="password" required style="width: 100%; padding: 10px; margin: 5px 0 20px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
            
            <button type="submit" style="width: 100%; padding: 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">ACCEDER AL SISTEMA</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

app.post('/login-web', async (req, res) => {
  try {
    const datosValidados = loginSchema.parse(req.body);
    const { usuario, password } = datosValidados;
    
    const query = `SELECT * FROM USUARIOS_GAD WHERE nombre_usuario = $1 AND contrasenia = $2`;
    const result = await pool.query(query, [usuario, password]);

    if (result.rows.length > 0) {
      const nombreUsuario = result.rows[0].nombre_usuario;
      mostrarMenuWeb(res, nombreUsuario);
    } else {
      res.send(`<script>alert('Usuario o contraseña incorrectos'); window.location.href='/';</script>`);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.send(`<script>alert('Error de validación: ${err.errors[0].message}'); window.location.href='/';</script>`);
    }

    if (req.body.usuario === 'admin' && req.body.password === '12345') {
      mostrarMenuWeb(res, 'Administrador GAD (Respaldo)');
    } else {
      res.send(`<script>alert('Error de base de datos o credenciales incorrectas'); window.location.href='/';</script>`);
    }
  }
});

function mostrarMenuWeb(res, nombreUsuario) {
  res.send(`
    <html>
      <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #e0e0e0; margin: 0;">
        <div style="text-align: center; padding: 40px; border: 2px solid #333; border-radius: 5px; background: #f0f0f0; width: 400px;">
          <h1 style="margin: 0; color: #333;">Conecta GAD</h1>
          <p style="font-weight: bold; color: green;">Bienvenido: ${nombreUsuario}</p>
          <br>
          <a href="/asistencias" style="display: block; margin-bottom: 10px; padding: 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">VER ASISTENCIAS</a>
          <a href="/registrar" style="display: block; padding: 15px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 20px;">REGISTRAR ASISTENCIA</a>
          <hr>
          <a href="/" style="color: red; text-decoration: none; font-weight: bold;">Cerrar Sesión</a>
        </div>
      </body>
    </html>
  `);
}

// 2. ENDPOINT DE LOGIN PARA LA APP MÓVIL Y CHROME
app.post('/api/login', async (req, res) => {
  try {
    const datosValidados = loginSchema.parse(req.body);
    const { usuario, password } = datosValidados; // <-- Error corregido aquí

    const query = `SELECT * FROM USUARIOS_GAD WHERE nombre_usuario = $1 AND contrasenia = $2`;
    const result = await pool.query(query, [usuario, password]);

    if (result.rows.length > 0) {
      const userRecord = result.rows[0];
      return res.status(200).json({
        success: true,
        mensaje: 'Acceso autorizado',
        usuario: {
          nombre: userRecord.nombre_usuario,
          correo: userRecord.rol || 'usuario@gadcontrol.local'
        }
      });
    } else {
      return res.status(401).json({ success: false, mensaje: 'Usuario o contraseña incorrectos' });
    }

  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Error de validación', 
        errores: err.errors.map(e => e.message) 
      });
    }

    if (req.body.usuario === 'admin' && req.body.password === '12345') {
      return res.status(200).json({
        success: true,
        mensaje: 'Acceso autorizado (Modo Respaldo)',
        usuario: { nombre: 'Administrador GAD', correo: 'admin@gadcontrol.local' }
      });
    } else {
      return res.status(500).json({ success: false, error: "Error en base de datos: " + err.message });
    }
  }
});

// 3. RUTAS DE ASISTENCIA Y REGISTRO
app.get('/registrar', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial; padding: 40px; background-color: #f4f4f9;">
        <h2>Registro de Asistencia - Conecta GAD</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <form action="/guardar" method="POST">
            <p>Tipo de marcación:</p>
            <select name="tipo" style="padding: 10px; width: 100%;">
              <option value="INGRESO">Ingreso</option>
              <option value="SALIDA_ALMUERZO">Salida al Almuerzo</option>
              <option value="REGRESO_ALMUERZO">Regreso del Almuerzo</option>
              <option value="FIN_LABORES">Fin de Labores</option>
            </select>
            <br><br>
            <button type="submit" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Registrar</button>
          </form>
          <br>
          <a href="/">← Salir / Volver al Login</a>
        </div>
      </body>
    </html>
  `);
});

app.post('/guardar', async (req, res) => {
  const { tipo } = req.body;
  try {
    const query = `INSERT INTO ASISTENCIA (id_empleado, fecha_hora, tipo_registro) VALUES ($1, NOW(), $2)`;
    await pool.query(query, [1, tipo || 'INGRESO']); 
    
    res.send('<h2>Asistencia registrada con éxito</h2><br><a href="/registrar">Registrar otro</a> | <a href="/">Salir al Login</a>');
  } catch (err) {
    res.status(500).send("Error al registrar: " + err.message);
  }
});

app.get('/asistencias', async (req, res) => {
  try {
    const query = `SELECT id_asistencia, TO_CHAR(fecha_hora, 'YYYY-MM-DD HH24:MI:SS') AS fecha_hora, id_empleado, tipo_registro FROM ASISTENCIA ORDER BY fecha_hora DESC`;
    const result = await pool.query(query);

    let rowsHtml = result.rows.map(r => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 12px;">${r.id_asistencia}</td>
        <td style="padding: 12px;">${r.fecha_hora}</td>
        <td style="padding: 12px;">${r.id_empleado}</td>
        <td style="padding: 12px;">${r.tipo_registro}</td>
      </tr>`).join('');

    res.send(`
      <html>
        <head><title>Asistencias</title></head>
        <body style="font-family: Arial; padding: 20px; background-color: #f4f4f9;">
          <h2 style="color: #333;">Reporte de Asistencias - Conecta GAD Gestión 2026</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <tr style="background-color: #007bff; color: white; text-align: left;">
              <th style="padding: 12px;">ID</th><th style="padding: 12px;">Fecha y Hora</th>
              <th style="padding: 12px;">ID Empleado</th><th style="padding: 12px;">Tipo Registro</th>
            </tr>
            ${rowsHtml}
          </table>
          <br>
          <a href="/">← Salir / Volver al Login</a>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Error al obtener datos: " + err.message);
  }
});

app.listen(3000, () => console.log('Servidor Conecta GAD activo en http://localhost:3000'));