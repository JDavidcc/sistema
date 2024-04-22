const express = require('express');
const session = require('express-session');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { ValidarUsuario } = require('./validar.js');
const { poll } = require('./validar.js');

const app = express();

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));

// validar la sesión del usuario
function validarSesion(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.status(401).json({ message: '401- Acceso no autorizado' });
  }
}

// Manejar las peticiones POST de /login
app.post('/login', (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { correo, pass } = JSON.parse(body);
    ValidarUsuario(correo, pass)
      .then((valid) => {
        if (valid) {
          req.session.loggedIn = true;
        }
        const responseMessage = valid ? 'Credenciales correctas' : 'Credenciales incorrectas';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: responseMessage }));
      })
      .catch((error) => {
        console.error('Error en la validación de usuario:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error en la validación de usuario' }));
      });
  });
});

// ruta para el menú
app.get('/menu', validarSesion, (req, res) => {
  const filePath = path.join(__dirname, 'menu.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

// ruta logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      res.status(500).json({ message: 'Error al cerrar sesión' });
      return;
    }
    const filePath = path.join(__dirname, 'logout.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.status(500).send(`Error: ${err}`);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  });
});

// Ruta para mostrar la página HTML de materias
app.get('/materias', validarSesion, (req, res) => {
  const filePath = path.join(__dirname, 'materias.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

// Ruta para obtener lista de materias  JSON
app.get('/api/materias', validarSesion, (req, res) => {
  const query = `
    SELECT materias.id, materias.nombre, carreras.nombre AS nombre_carrera, materias.descripcion
    FROM materias
    INNER JOIN carreras ON materias.carrera_id = carreras.id
  `;
  poll.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener la lista de materias:', error);
      res.status(500).json({ message: 'Error al obtener la lista de materias' });
      return;
    }
    res.json(results); // Enviar la lista de materias JSON
  });
});

// Ruta para mostrar HTML de carreras
app.get('/carreras', validarSesion, (req, res) => {
  const filePath = path.join(__dirname, 'carreras.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

    //correjir para alumnos

// Ruta para mostrar la página HTML de alumnos
app.get('/alumnos', validarSesion, (req, res) => {
  const filePath = path.join(__dirname, 'alumnos.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

// Ruta para obtener lista de alumnos  JSON
app.get('/api/alumnos', validarSesion, (req, res) => {
    const query = `
    SELECT alumnos.nombre, alumnos.apellido, alumnos.edad, alumnos.carrera_id, carreras.nombre AS nombre_carrera
    FROM alumnos
    JOIN carreras ON alumnos.carrera_id = carreras.id`;

  poll.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener la lista de alumnos:', error);
      res.status(500).json({ message: 'Error al obtener la lista de alumnos' });
      return;
    }
    res.json(results); // Enviar la lista de alumnos JSON
  });
});

// Ruta para obtener la lista de carreras 
app.get('/api/carreras', validarSesion, (req, res) => {
  const query = 'SELECT * FROM carreras';

  poll.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener la lista de carreras:', error);
      res.status(500).json({ message: 'Error al obtener la lista de carreras' });
      return;
    }
    res.json(results); // Enviar la lista
  });
});

// Manejar otras rutas
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
