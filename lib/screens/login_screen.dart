import 'package:flutter/material.dart';
import 'home_screen.dart'; // Asegúrate de importar tu pantalla principal

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Controladores para capturar el texto de los inputs
  final TextEditingController _usuarioController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _usuarioController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo/Icono representativo
              Icon(Icons.admin_panel_settings, size: 80, color: Colors.blue[900]),
              const SizedBox(height: 16),
              
              // Título Institucional
              const Text(
                'SISTEMA INTEGRAL',
                style: TextStyle(fontSize: 12, color: Colors.grey, letterSpacing: 1.5, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'GAD Control',
                style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.blue[900]),
              ),
              const SizedBox(height: 8),
              const Text(
                'Gestión eficiente de asistencias y registros institucionales.',
                style: TextStyle(fontSize: 14, color: Colors.black54),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),

              // Formulario
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Iniciar sesión',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 20),
              
              TextField(
                controller: _usuarioController,
                decoration: InputDecoration(
                  labelText: 'Usuario Institucional',
                  prefixIcon: const Icon(Icons.person_outline),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),
              
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Contraseña',
                  prefixIcon: const Icon(Icons.lock_outline),
                  suffixIcon: const Icon(Icons.visibility_off),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 24),
              
              // Botón de acceso
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue[900],
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    // Obtenemos el texto ingresado en el campo de usuario
                    String usuarioIngresado = _usuarioController.text.trim();
                    
                    // Si el campo está vacío, ponemos un nombre por defecto para la demo
                    String nombreFinal = usuarioIngresado.isEmpty ? 'Funcionario GAD' : usuarioIngresado;

                    // Navegamos a la pantalla de bienvenida (HomeScreen)
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => HomeScreen(
                          nombreUsuario: nombreFinal,
                          correoUsuario: '${usuarioIngresado.toLowerCase()}${(usuarioIngresado.isEmpty ? "funcionario" : "")}@gadcontrol.local',
                        ),
                      ),
                    );
                  },
                  child: const Text('ACCEDER', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}