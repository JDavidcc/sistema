/* eslint-disable no-undef */
/* eslint-disable n/no-callback-literal */
/* eslint-disable no-unused-vars */
const { error } = require('console')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '',
  database: 'sistemaescolar'
})

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos MySQL: ', err)
    return
  }
  console.log('Conectado a la base de datos MySQL.')
})

function ValidarUsuario (correo, pass) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM usuarios WHERE correo = '${correo}' AND pass = '${pass}'`

    connection.query(query, (error, results) => {
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
