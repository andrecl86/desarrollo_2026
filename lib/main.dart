import 'package:flutter/material.dart';
import 'models/asistencia.dart';
import 'services/asistencia_service.dart'; // Importa tu servicio

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Conecta GAD - Asistencias')),
        body: const AsistenciaList(),
      ),
    );
  }
}

class AsistenciaList extends StatefulWidget {
  const AsistenciaList({super.key});

  @override
  State<AsistenciaList> createState() => _AsistenciaListState();
}

class _AsistenciaListState extends State<AsistenciaList> {
  // CORRECCIÓN AQUÍ: Usamos AsistenciaService
  final AsistenciaService apiService = AsistenciaService(); 
  late Future<List<Asistencia>> futureAsistencias;

  @override
  void initState() {
    super.initState();
    futureAsistencias = apiService.getAsistencias();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Asistencia>>(
      future: futureAsistencias,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text("Error: ${snapshot.error}"));
        } else if (snapshot.hasData) {
          return ListView.builder(
            itemCount: snapshot.data!.length,
            itemBuilder: (context, index) {
              final item = snapshot.data![index];
              return ListTile(
                leading: const Icon(Icons.person),
                title: Text("ID Asistencia: ${item.idAsistencia}"),
                subtitle: Text("Fecha: ${item.fecha} - Hora: ${item.horaRegistro}"),
              );
            },
          );
        }
        return const Center(child: Text("No hay datos"));
      },
    );
  }
}