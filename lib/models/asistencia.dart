class Asistencia {
  final int idAsistencia;
  final String fecha;
  final String horaRegistro;
  final int idEmpleado;
  final int idHorario;

  Asistencia({
    required this.idAsistencia, 
    required this.fecha, 
    required this.horaRegistro,
    required this.idEmpleado,
    required this.idHorario
  });

  factory Asistencia.fromJson(Map<String, dynamic> json) {
    return Asistencia(
      idAsistencia: json['ID_ASISTENCIA'] ?? 0,
      fecha: json['FECHA'] ?? '',
      horaRegistro: json['HORA_REGISTRO'] ?? '',
      idEmpleado: json['ID_EMPLEADO'] ?? 0,
      idHorario: json['ID_HORARIO'] ?? 0,
    );
  }
}