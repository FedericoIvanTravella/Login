import React, { useMemo, useState } from 'react'
import ImagenRegistro from '../../assets/img/Form/Form2.jpg'
import { RegistrarUsuario, UrlImagen } from '../../services/api'

// --> Datos de cada campo del formulario, en el mismo orden en que se muestran en pantalla
const CAMPOS = [
  {
    id: 'User',
    name: 'User',
    label: 'Usuario',
    tipo: 'text',
    autoComplete: 'username',
    placeholder: 'juan.perez',
    ayuda: 'Es el nombre con el que vas a iniciar sesión.',
  },
  {
    id: 'Name',
    name: 'Name',
    label: 'Nombre y apellido',
    tipo: 'text',
    autoComplete: 'name',
    placeholder: 'Juan Pérez',
    ayuda: 'Así te vamos a llamar dentro de Nexo.',
  },
  {
    id: 'Password',
    name: 'Password',
    label: 'Contraseña',
    tipo: 'password',
    autoComplete: 'new-password',
    placeholder: 'Mínimo 8 caracteres',
    ayuda: 'Usá al menos 8 caracteres.',
  },
  {
    id: 'Password2',
    name: 'Password2',
    label: 'Repetir contraseña',
    tipo: 'password',
    autoComplete: 'new-password',
    placeholder: 'Volvé a escribirla',
    ayuda: 'Tiene que coincidir con la anterior.',
  },
]

// --> Estado inicial del formulario
const VACIO = { User: '', Name: '', Password: '', Password2: '' }

// --> Escala de fuerza de la contraseña, con los mismos colores de éxito y error del proyecto
const FUERZA = [
  { etiqueta: 'Muy débil', color: 'var(--form-error)' },
  { etiqueta: 'Débil', color: 'var(--form-accent)' },
  { etiqueta: 'Buena', color: 'var(--form-accent)' },
  { etiqueta: 'Fuerte', color: 'var(--form-ok)' },
]

// --> Puntúa la contraseña de 0 a 4 según largo, mezcla de mayúsculas, números y símbolos
const CalcularFuerza = (clave) => {
  if (!clave) return -1

  let puntos = 0
  if (clave.length >= 8) puntos += 1
  if (clave.length >= 12) puntos += 1
  if (/[a-z]/.test(clave) && /[A-Z]/.test(clave)) puntos += 1
  if (/\d/.test(clave)) puntos += 1
  if (/[^\w\s]/.test(clave)) puntos += 1

  return Math.min(3, puntos)
}

function RegistroUsuario() {
  const [Datos, setDatos] = useState(VACIO)
  const [VerClaves, setVerClaves] = useState(false)
  const [Cargando, setCargando] = useState(false)
  const [Respuesta, setRespuesta] = useState(null)
  const [Invalido, setInvalido] = useState('')

  const Nivel = useMemo(() => CalcularFuerza(Datos.Password), [Datos.Password])
  const Coinciden = Datos.Password.length > 0 && Datos.Password === Datos.Password2

  const Cambiar = (evento) => {
    const { name, value } = evento.target

    setDatos((anterior) => ({ ...anterior, [name]: value }))
    setRespuesta(null)
    setInvalido((campo) => (campo === name ? '' : campo))
  }



  // --> Revisa los datos en el navegador para no gastar un viaje al servidor
  const Revisar = () => {
    if (!Datos.User.trim()) return { campo: 'User', mensaje: 'Escribí un nombre de usuario.' }
    if (Datos.User.trim().length < 3) {
      return { campo: 'User', mensaje: 'El usuario necesita al menos 3 caracteres.' }
    }
    if (!Datos.Name.trim()) return { campo: 'Name', mensaje: 'Completá tu nombre y apellido.' }
    if (Datos.Password.length < 8) {
      return { campo: 'Password', mensaje: 'La contraseña necesita al menos 8 caracteres.' }
    }
    if (Datos.Password !== Datos.Password2) {
      return { campo: 'Password2', mensaje: 'Las contraseñas no coinciden.' }
    }

    return null
  }

  // --> El texto de ayuda del último campo confirma o corrige el ingreso de la contraseña
  const Ayuda = (campo) => {
    if (campo.name !== 'Password2' || Datos.Password2.length === 0) {
      return { texto: campo.ayuda, estado: '' }
    }

    return Coinciden
      ? { texto: 'Las contraseñas coinciden.', estado: 'ok' }
      : { texto: 'Las contraseñas no coinciden.', estado: 'error' }
  }

  const Enviar = async (evento) => {
    evento.preventDefault()
    if (Cargando) return

    const problema = Revisar()

    if (problema) {
      setInvalido(problema.campo)
      setRespuesta({ esExito: false, mensaje: problema.mensaje })
      return
    }

    setCargando(true)
    setRespuesta(null)
    setInvalido('')

    try {
      const datos = await RegistrarUsuario({
        User: Datos.User.trim(),
        Name: Datos.Name.trim(),
        Password: Datos.Password,
      })

      setRespuesta({ esExito: true, mensaje: datos.mensaje || datos.message, imagen: datos.imagen })
      setDatos(VACIO)
      setVerClaves(false)
    } catch (error) {
      setRespuesta({ esExito: false, mensaje: error.message, imagen: error.datos?.imagen })
      // --> Si el servidor responde 409 el problema está en el nombre de usuario
      setInvalido(error.status === 409 ? 'User' : '')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="contenedorFormulario contenedorFormulario--registro">
      <img className="formulario-imagen" src={ImagenRegistro} alt="Panel de registro" />

      <div className="formulario-velo" aria-hidden="true">
        <p className="formulario-marca">Nexo</p>
        <p className="formulario-leyenda">Soluciones digitales para trabajar simple y rápido.</p>
      </div>

      <form className="formLogin formRegistro" onSubmit={Enviar} noValidate aria-busy={Cargando}>
        <p className="formulario-kicker">Registro</p>
        <h1>Creá tu cuenta</h1>
        <p className="formulario-bajada">
          Completá tus datos y en segundos vas a tener tu usuario de Nexo.
        </p>

        {Respuesta && (
          <div
            className={`respuesta ${Respuesta.esExito ? 'respuesta-exito' : 'respuesta-error'}`}
            role="alert"
            aria-live="polite"
          >
            <p className="respuesta-mensaje">{Respuesta.mensaje}</p>
            {Respuesta.imagen && (
              <img
                className="respuesta-imagen"
                src={UrlImagen(Respuesta.imagen)}
                alt=""
              />
            )}
          </div>
        )}

        <div className="formulario-acciones">
          <button
            type="button"
            className="formulario-alternar"
            aria-pressed={VerClaves}
            onClick={() => setVerClaves((visible) => !visible)}
          >
            {VerClaves ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
          </button>
        </div>

        <div className="formulario-campos">
          {CAMPOS.map((campo) => {
            const ayuda = Ayuda(campo)

            return (
              <div
                className={`formulario-campo${Invalido === campo.id ? ' formulario-campo--invalido' : ''}`}
                key={campo.id}
              >
                <label htmlFor={campo.id}>{campo.label}</label>
                <input
                  type={campo.tipo === 'password' && VerClaves ? 'text' : campo.tipo}
                  name={campo.name}
                  id={campo.id}
                  autoComplete={campo.autoComplete}
                  placeholder={campo.placeholder}
                  aria-invalid={Invalido === campo.id}
                  aria-describedby={`${campo.id}-ayuda`}
                  value={Datos[campo.name]}
                  onChange={Cambiar}
                  required
                />

                {campo.name === 'Password' && Nivel >= 0 && (
                  <div className="formulario-fuerza">
                    <div className="formulario-fuerza-barra" aria-hidden="true">
                      {FUERZA.map((nivel, indice) => (
                        <span
                          className="formulario-fuerza-segmento"
                          key={nivel.etiqueta}
                          style={indice <= Nivel ? { background: nivel.color } : undefined}
                        />
                      ))}
                    </div>
                    <p className="formulario-fuerza-texto">
                      Seguridad de la contraseña: <strong>{FUERZA[Nivel].etiqueta}</strong>
                    </p>
                  </div>
                )}

                <p
                  id={`${campo.id}-ayuda`}
                  className={`formulario-ayuda${ayuda.estado ? ` formulario-ayuda--${ayuda.estado}` : ''}`}
                >
                  {ayuda.texto}
                </p>
              </div>
            )
          })}
        </div>

        <button type="submit" className="btnIngresar" disabled={Cargando}>
          {Cargando ? (
            <span className="formulario-cargando">
              <span className="formulario-spinner" aria-hidden="true" />
              Registrando...
            </span>
          ) : (
            'Registrar usuario'
          )}
        </button>

        <p className="formulario-nota">
          ¿Ya tenés cuenta? <a href="">Ingresá</a>
        </p>
      </form>
    </section>
  )
}

export default RegistroUsuario
