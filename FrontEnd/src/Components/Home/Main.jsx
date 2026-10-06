import { useState } from 'react'
import ImagenLogin from '../../assets/img/Form/0c2c7ef78e160a7656623b05c82d9fb2.jpg'
import { IniciarSesion, UrlImagen } from '../../services/api'

function Main() {
  const [User, setUser] = useState('')
  const [Password, setPassword] = useState('')
  const [Cargando, setCargando] = useState(false)
  const [Respuesta, setRespuesta] = useState(null)

  const Enviar = async (evento) => {
    evento.preventDefault()
    setCargando(true)
    setRespuesta(null)

    try {
      const datos = await IniciarSesion({ User, Password })
      setRespuesta({ esExito: true, ...datos })
      setUser('')
      setPassword('')
    } catch (error) {
      setRespuesta({ esExito: false, ...error.datos, mensaje: error.message })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="contenedorFormulario">
      <img className="formulario-imagen" src={ImagenLogin} alt="Panel de acceso" />

      <form className="formLogin" onSubmit={Enviar} noValidate>
        <h1>Login</h1>

        {Respuesta && (
          <div className={`respuesta ${Respuesta.esExito ? 'respuesta-exito' : 'respuesta-error'}`} role="alert">
            <p className="respuesta-mensaje">{Respuesta.mensaje || Respuesta.message}</p>
            {Respuesta.imagen && (
              <img
                className="respuesta-imagen"
                src={UrlImagen(Respuesta.imagen)}
                alt={Respuesta.mensaje || Respuesta.message}
              />
            )}
          </div>
        )}

        <label htmlFor="User">User:</label>
        <input
          type="text"
          name="User"
          id="User"
          autoComplete="username"
          value={User}
          onChange={(evento) => setUser(evento.target.value)}
          required
        />

        <label htmlFor="Password">Password:</label>
        <input
          type="password"
          name="Password"
          id="Password"
          autoComplete="current-password"
          value={Password}
          onChange={(evento) => setPassword(evento.target.value)}
          required
        />

        <button type="submit" className="btnIngresar" disabled={Cargando}>
          {Cargando ? 'Verificando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

export default Main
