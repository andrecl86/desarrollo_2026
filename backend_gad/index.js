const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
app.use(cors());
// Middleware necesario para procesar los datos del formulario
app.use(express.urlencoded({ extended: true }));

// Especificación de Conexión (Pool) - Mantenido según SDD
const dbConfig = {
  user: "GAD_RESPALDO",
  password: "GAD2026",
  connectString: "localhost:1521/ORCLCDB",
  poolMin: 2,
  poolMax: 10
};

async function initialize() {
  try {
    await oracledb.createPool(dbConfig);
    console.log("Pool de conexiones a Oracle creado exitosamente.");
  } catch (err) {
    console.error("Error al crear el pool:", err.message);
  }
}
initialize();

// Interfaz Web Principal actualizada con el nuevo botón
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #e0e0e0;">
        <div style="text-align: center; padding: 40px; border: 2px solid #333; border-radius: 5px; background: #f0f0f0; width: 400px;">
          <h1 style="margin: 0; color: #333;">Conecta GAD</h1>
          <p style="font-weight: bold;">Gestión 2026</p>
          <br>
          <a href="/asistencias" style="display: block; margin-bottom: 10px; padding: 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">VER ASISTENCIAS</a>
          <a href="/registrar" style="display: block; padding: 15px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">REGISTRAR ASISTENCIA</a>
        </div>
      </body>
    </html>
  `);
});

// Nueva ruta para formulario de registro (Diseño conforme al SDD)
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
          <a href="/">← Volver al inicio</a>
        </div>
      </body>
    </html>
  `);
});

// Lógica de registro corregida (sin depender de secuencia externa)
app.post('/guardar', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    // Cálculo de ID automático para evitar errores de secuencia
    await connection.execute(
      `INSERT INTO GAD_MATRIZ.ASISTENCIA (ID_ASISTENCIA, FECHA, HORA_REGISTRO, ID_EMPLEADO, ID_HORARIO) 
       VALUES (
         (SELECT NVL(MAX(ID_ASISTENCIA), 0) + 1 FROM GAD_MATRIZ.ASISTENCIA), 
         SYSDATE, 
         TO_CHAR(SYSDATE, 'HH24:MI'), 
         101, 
         10
       )`, 
      [], { autoCommit: true }
    );
    res.send('<h2>Asistencia registrada con éxito</h2><br><a href="/registrar">Registrar otro</a> | <a href="/">Inicio</a>');
  } catch (err) {
    res.status(500).send("Error al registrar: " + err.message);
  } finally {
    if (connection) await connection.close();
  }
});

// Endpoint de Asistencias - Mantenido según especificaciones técnicas
app.get('/asistencias', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT ID_ASISTENCIA, TO_CHAR(FECHA, 'YYYY-MM-DD') AS FECHA, 
              HORA_REGISTRO, ID_EMPLEADO, ID_HORARIO 
       FROM GAD_MATRIZ.ASISTENCIA ORDER BY FECHA DESC, HORA_REGISTRO DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    let rowsHtml = result.rows.map(r => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 12px;">${r.ID_ASISTENCIA}</td>
        <td style="padding: 12px;">${r.FECHA}</td>
        <td style="padding: 12px;">${r.HORA_REGISTRO}</td>
        <td style="padding: 12px;">${r.ID_EMPLEADO}</td>
        <td style="padding: 12px;">${r.ID_HORARIO}</td>
      </tr>`).join('');

    res.send(`
      <html>
        <head><title>Asistencias</title></head>
        <body style="font-family: Arial; padding: 20px; background-color: #f4f4f9;">
          <h2 style="color: #333;">Reporte de Asistencias - Conecta GAD Gestión 2026</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <tr style="background-color: #007bff; color: white; text-align: left;">
              <th style="padding: 12px;">ID</th><th style="padding: 12px;">Fecha</th>
              <th style="padding: 12px;">Hora</th><th style="padding: 12px;">Empleado</th>
              <th style="padding: 12px;">Horario</th>
            </tr>
            ${rowsHtml}
          </table>
          <br>
          <a href="/">← Volver al inicio</a>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Error al obtener datos: " + err.message);
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(3000, () => console.log('Servidor Conecta GAD activo en http://localhost:3000'));