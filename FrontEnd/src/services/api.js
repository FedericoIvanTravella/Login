// --> URL base del backend. Puede sobreescribirse con VITE_API_URL en FrontEnd/.env
const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/*
  Pedir: helper único para hablar con la API.
  Arma la URL, envía el cuerpo en JSON y normaliza la respuesta.
  Si el servidor contesta con un estado de error, lanza una excepción que
  conserva el status y el cuerpo del servidor (mensaje + imagen).
*/
const Pedir = async (ruta, metodo = 'POST', cuerpo) => {
  let respuesta

  try {
    respuesta = await fetch(`${URL_API}/api${ruta}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    })
  } catch {
    // --> Si no hay respuesta no fue un error de la API, sino que el backend no está levantado
    throw Object.assign(
      new Error(`No se pudo conectar con el servidor (${URL_API}). Verificá que esté corriendo "npm run server" en la carpeta Server.`),
      { status: 0, datos: {} }
    )
  }

  const datos = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    throw Object.assign(
      new Error(datos.mensaje || datos.message || datos.error || 'Error en la Conexion con el Servidor'),
      { status: respuesta.status, datos }
    )
  }

  return datos
}

// --> Inicia sesión con las credenciales del usuario
export const IniciarSesion = (credenciales) => Pedir('/Login', 'POST', credenciales)

// --> Registra un usuario nuevo
export const RegistrarUsuario = (datos) => Pedir('/Registrar', 'POST', datos)

// --> Convierte la ruta de imagen que devuelve el servidor en una URL usable por el <img>
export const UrlImagen = (ruta) => (ruta ? new URL(ruta, URL_API).href : null)
