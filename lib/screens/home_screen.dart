import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  final String nombreUsuario;
  final String correoUsuario;

  const HomeScreen({
    Key? key,
    required this.nombreUsuario,
    required this.correoUsuario,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Inicio - GAD Control'),
        backgroundColor: Colors.blue[900],
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'BIENVENIDO A GAD CONTROL',
              style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              'Hola, $nombreUsuario',
              style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.blue[900]),
            ),
            const SizedBox(height: 8),
            const Text(
              'Todo listo para gestionar tus registros institucionales.',
              style: TextStyle(color: Colors.black54),
            ),
            const SizedBox(height: 24),

            // Tarjeta de Perfil del Usuario
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    spreadRadius: 2,
                    blurRadius: 5,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: Colors.blue[900],
                    child: Text(
                      nombreUsuario.isNotEmpty ? nombreUsuario[0].toUpperCase() : 'U',
                      style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 16, width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('TU CUENTA', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                        Text(nombreUsuario, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        Text(correoUsuario, style: const TextStyle(color: Colors.black54, fontSize: 13)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),

            // Botón de Cerrar Sesión
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.blue.shade900),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () {
                  // Regresar al Login
                  Navigator.pop(context);
                },
                child: Text('Cerrar sesión', style: TextStyle(color: Colors.blue[900], fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}