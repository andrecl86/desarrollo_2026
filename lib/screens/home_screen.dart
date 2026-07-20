import 'package:flutter/material.dart';
import '../services/asistencia_service.dart';
import '../models/asistencia.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final AsistenciaService _service = AsistenciaService();
  List<Asistencia> _asistencias = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _cargarDatos();
  }

  Future<void> _cargarDatos() async {
    try {
      final datos = await _service.getAsistencias();
      setState(() {
        _asistencias = datos;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Conecta GAD - Asistencias")),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _asistencias.length,
              itemBuilder: (context, index) {
                final item = _asistencias[index];
                return ListTile(
                  leading: const Icon(Icons.person),
                  title: Text("Fecha: ${item.fecha}"),
                  subtitle: Text("ID Asistencia: ${item.idAsistencia}"),
                );
              },
            ),
    );
  }
}