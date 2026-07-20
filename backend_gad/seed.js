const oracledb = require('oracledb');

const dbConfig = {
  user: "GAD_RESPALDO",
  password: "GAD2026",
  connectString: "localhost:1521/ORCLCDB"
};

async function seedData() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log("Conectado para poblar datos...");

    // He cambiado el ID_HORARIO a 10 (que sí existe en tu tabla)
    const sql = `INSERT INTO GAD_MATRIZ.ASISTENCIA 
                 (ID_ASISTENCIA, FECHA, HORA_REGISTRO, ID_EMPLEADO, ID_HORARIO) 
                 VALUES (:1, TO_DATE(:2, 'YYYY-MM-DD'), :3, :4, :5)`;
    
    const data = [
      [1, '2026-07-19', '08:00', 101, 10], // Usando ID_HORARIO 10
      [2, '2026-07-19', '08:05', 102, 10]
    ];

    for (let row of data) {
      await connection.execute(sql, row, { autoCommit: true });
    }

    console.log("Datos de prueba cargados correctamente en la tabla ASISTENCIA.");
  } catch (err) {
    console.error("Error al poblar datos:", err.message);
  } finally {
    if (connection) await connection.close();
  }
}

seedData();