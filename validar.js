/* eslint-disable no-undef */
/* eslint-disable n/no-callback-literal */
/* eslint-disable no-unused-vars */
const { error } = require('console')
const mysql = require('mysql')
require('dotenv').config()

// Conexion a la base de datos MySQL
const poll = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function ValidarUsuario (correo, pass) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM usuarios WHERE correo = '${correo}' AND pass = '${pass}'`

    poll.query(query, (error, results) => {
      if (error) {
        console.error('Error en la query a la base de datos: ', error)
        reject(error)
        return
      }

      if (results.length > 0) {
        console.log('Credenciales correctas')
        resolve(true)
      } else {
        console.log('Credenciales incorrectas')
        resolve(false)
      }
    })
  })
}

module.exports = ValidarUsuario

//      PRUEBA QUERY USUARIOS

// const usuarios = 'SELECT * FROM usuarios'
// connection.query(usuarios, function (error, lista) {
//   if (error) {
//     throw error
//   } else {
//     console.log(lista)
//   }
// })
