import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/asistencia.dart';

class AsistenciaService {
  // Nota: Usamos localhost porque estamos ejecutando en el navegador (Chrome)
  final String baseUrl = 'http://localhost:3000/asistencias';

  Future<List<Asistencia>> getAsistencias() async {
    try {
      final response = await http.get(Uri.parse(baseUrl));
      
      if (response.statusCode == 200) {
        List<dynamic> jsonResponse = json.decode(response.body);
        return jsonResponse.map((data) => Asistencia.fromJson(data)).toList();
      } else {
        throw Exception('Error al cargar datos: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}