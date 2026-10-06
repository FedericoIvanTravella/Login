const { ConexionBD } = require('../DataBase/db')

const { EncriptarPassword, CompararPassword } = require('../Utils/PasswordHash')

const { ObtenerImagen } = require('../Utils/StatusImagen')

// --> async debido a que bcrypt utiliza promesas para generar el hash de la contraseña
const RegistrarUsuario = async (req, res) => {
    const { User, Password, Name } = req.body;
    try {
        // --> ! Validar que los campos no estén vacíos
        if (!User || !Password) {
            console.log('Debe Completar los Datos para Continuar')
            return res.status(404).json({
                error: 'Debe completar el Usuario y/o la Contraseña',
                imagen: ObtenerImagen('DatosIncompletos')
            })
        }
        // --> Consulta para verificar si el usuario ya está registrado
        const Buscar = `SELECT * FROM Usuarios WHERE User=?`
        ConexionBD.get(Buscar, [User], async (error, Perfil) => {
            // --> Validar si hubo un error en la consulta
            if (error) {
                console.error('Error al buscar el usuario en la base de datos', error.message)
                return res.status(500).json({
                    error: 'Error en la Conexion con el Servidor',
                    imagen: ObtenerImagen('ErrorServidor')
                })
            }
            // --> Validar si el usuario ya existe
            if (Perfil) {
                console.error('El usuario ya se encuentra registrado')
                return res.status(409).json({
                    error: 'Usuario ya Registrado',
                    imagen: ObtenerImagen('UsuarioRegistrado')
                })
            }

            try {
                // --> Consulta para registrar el usuario
                const Query2 = `INSERT INTO Usuarios(User,Password,Name) VALUES(?,?,?)`

                // --> Encriptar la contraseña antes de guardarla en la base de datos
                const hash = await EncriptarPassword(Password)

                ConexionBD.run(Query2, [User, hash, Name], (error) => {
                    // --> Validar si hubo un error al registrar el usuario
                    if (error) {
                        console.error('Error al registrar el usuario', error.message)
                        return res.status(500).json({
                            error: 'Error en la Conexion con el Servidor',
                            imagen: ObtenerImagen('ErrorServidor')
                        })
                    }
                    // --> Usuario registrado correctamente
                    return res.status(200).json({
                        message: '✅ Usuario Registrado Correctamente',
                        imagen: ObtenerImagen('RegistroExitoso')
                    })
                })
            } catch (errorEncriptado) {
                console.error('Error al encriptar la contraseña', errorEncriptado.message)
                return res.status(500).json({
                    error: 'Error en la Conexion con el Servidor',
                    imagen: ObtenerImagen('ErrorServidor')
                })
            }
        })
    }
    catch (error) {
        console.error('Error al registrar el usuario', error.message)
        return res.status(500).json({
            error: 'Error en la Conexion con el Servidor',
            imagen: ObtenerImagen('ErrorServidor')
        })
    }
}


const IniciarSesion = async (req, res) => {
    const { User, Password } = req.body

    try {
        // --> Validar que los campos no estén vacíos
        if (!User || !Password) {
            console.error('Error: debe completar los campos para continuar')
            return res.status(404).json({
                mensaje: 'Debe completar el Usuario y/o la Contraseña',
                imagen: ObtenerImagen('DatosIncompletos')
            })
        }

        // --> Buscar el usuario por nombre
        const Consulta = `SELECT * FROM Usuarios WHERE User=?`

        ConexionBD.get(Consulta, [User], async (error, Perfil) => {
            // --> Validar si hubo un error en la consulta
            if (error) {
                console.error('Error al intentar encontrar el usuario', error.message)
                return res.status(500).json({
                    mensaje: 'Error al intentar encontrar el usuario',
                    imagen: ObtenerImagen('ErrorServidor')
                })
            }

            // --> Validar que el usuario exista
            if (!Perfil) {
                console.error('El usuario no se encuentra registrado')
                return res.status(401).json({
                    mensaje: 'Usuario no encontrado',
                    imagen: ObtenerImagen('UsuarioNoEncontrado')
                })
            }

            try {
                // --> Comparar la contraseña enviada contra el hash guardado
                const ValidarPassword = await CompararPassword(Password, Perfil.Password)

                if (!ValidarPassword) {
                    console.error('Contraseña incorrecta para el usuario:', User)
                    return res.status(401).json({
                        mensaje: 'Contraseña incorrecta',
                        imagen: ObtenerImagen('CredencialesInvalidas')
                    })
                }

                // --> Credenciales validadas
                console.log(`✅ Ingreso exitoso de: ${Perfil.User}`)
                return res.status(200).json({
                    mensaje: `Bienvenido ${Perfil.Name}`,
                    User: Perfil.User,
                    imagen: ObtenerImagen('LoginExitoso')
                })
            } catch (errorPassword) {
                console.error('Error al comparar la contraseña', errorPassword.message)
                return res.status(500).json({
                    mensaje: 'Error en la Conexion con el Servidor',
                    imagen: ObtenerImagen('ErrorServidor')
                })
            }
        })
    }
    catch (error) {
        console.error('Error en el servidor', error.message)
        return res.status(500).json({
            mensaje: 'Error en la Conexion con el Servidor',
            imagen: ObtenerImagen('ErrorServidor')
        })
    }
}

module.exports = { RegistrarUsuario, IniciarSesion }
