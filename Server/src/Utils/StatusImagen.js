/*
  Imagenes de estado: relación entre cada escenario de la API y la imagen
  que se devuelve dentro del JSON de respuesta.

  Las rutas apuntan al directorio estático que se publica en index.js
  con Express.static bajo el prefijo /status.
*/
const ImagenesEstado = {
    RegistroExitoso: '/status/status200.png',
    LoginExitoso: '/status/status200-.png',
    DatosIncompletos: '/status/status400-DatosIncompletos.png',
    CredencialesInvalidas: '/status/status401.png',
    UsuarioNoEncontrado: '/status/status404-NoexisteUsuario.png',
    NoEncontrado: '/status/status404.png',
    UsuarioRegistrado: '/status/status409.png',
    ErrorServidor: '/status/status500.png'
}

// --> Obtiene la imagen según el escenario. Si la clave no existe cae en la imagen de error de servidor
const ObtenerImagen = (Clave) => ImagenesEstado[Clave] || ImagenesEstado.ErrorServidor

module.exports = { ImagenesEstado, ObtenerImagen }
