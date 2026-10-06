const Express= require('express')
const {RegistrarUsuario, IniciarSesion}=require('../Controller/Login.Controller')

const Rutas= Express.Router()

// --> Post debido a que se envían datos sensibles como la contraseña del usuario
Rutas.post('/Registrar',RegistrarUsuario)
Rutas.post('/Login',IniciarSesion)

module.exports=Rutas