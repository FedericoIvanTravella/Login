# Sistema de Login

## Descripción

Este proyecto consiste en el desarrollo de un sistema de autenticación de usuarios mediante un servidor backend desarrollado con Node.js y Express, acompañado de un frontend construido con React y Vite.

El sistema permite gestionar usuarios almacenados en una base de datos SQLite, contemplando el registro de usuarios con usuario y contraseña.

La aplicación se encuentra organizada mediante una estructura modular que separa las responsabilidades del servidor, controladores, rutas, utilidades y acceso a la base de datos, y que a su vez mantiene el frontend dividido en componentes reutilizables con estilos centralizados.

## Estado actual

| Módulo | Funcionalidad | Estado |
| --- | --- | --- |
| Backend | Registro de usuarios (`POST /api/Registrar`) | Implementado |
| Backend | Inicio de sesión con verificación de contraseña | Pendiente |
| Backend | Persistencia en SQLite con hash de contraseña | Implementado |
| Frontend | Estructura de layout, Header y Footer | Implementado |
| Frontend | Formulario de registro y llamada a la API | Implementado |
| Frontend | Formulario de inicio de sesión | Pendiente |
| Frontend | Contenido principal (`Main.jsx`) | Pendiente |

El backend expone el endpoint de registro y el de inicio de sesión. El formulario de registro ya consume `POST /api/Registrar`, mientras que la pantalla de login todavía no está construida.

## Tecnologías utilizadas

### Frontend

- React
- React DOM
- Vite
- JavaScript (JSX)
- CSS3 puro
- ESLint

### Backend

- Node.js
- Express
- SQLite3
- bcrypt
- dotenv
- cors
- nodemon

### Herramientas

- Visual Studio Code
- Git y GitHub

## Estructura del proyecto

```text
Login/
│
├── FrontEnd/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── react.svg
│   │   │   ├── vite.svg
│   │   │   └── img/
│   │   │       ├── Logo.jpg
│   │   │       ├── Form/
│   │   │       └── Logo/
│   │   │
│   │   └── Components/
│   │       ├── Home/
│   │       │   ├── Footer.jsx
│   │       │   ├── Header.jsx
│   │       │   └── Main.jsx
│   │       ├── Layouts.css
│   │       └── Layouts.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .gitignore
│   └── README.md
│
├── Server/
│   ├── src/
│   │   ├── Controller/
│   │   │   └── Login.Controller.js
│   │   │
│   │   ├── DataBase/
│   │   │   ├── db.js
│   │   │   └── Urban.db
│   │   │
│   │   ├── Router/
│   │   │   └── Login.Route.js
│   │   │
│   │   └── Utils/
│   │       └── PasswordHash.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
└── Testing/
    ├── Registro de un Nuevo Usuario.png
    └── Usuario Existente.png
```

## Backend

El servidor utiliza CommonJS y expone la API bajo el prefijo `/api`. El archivo de entrada es `index.js`, que inicializa Express, carga las variables de entorno con `dotenv`, habilita `cors` de forma abierta y aplica el parser de cuerpos JSON.

### Dependencias

| Paquete | Versión | Uso |
| --- | --- | --- |
| `express` | ^5.2.1 | Servidor HTTP y enrutado |
| `sqlite3` | ^6.0.1 | Persistencia en base de datos |
| `bcrypt` | ^6.0.0 | Hash de contraseñas |
| `cors` | ^2.8.6 | Permisos de origen cruzado |
| `dotenv` | ^17.4.2 | Carga de variables de entorno |
| `nodemon` | ^3.1.14 | Recarga automática en desarrollo |

### Puesta en marcha

```bash
cd Server
npm install
npm run server
```

El script `server` ejecuta `nodemon index.js`. El servidor queda escuchando en el puerto definido por la variable de entorno `PORT`, con valor por defecto `3000`.

### Variables de entorno

El archivo `Server/.env` define la configuración utilizada por el servidor:

| Variable | Valor por defecto | Descripción |
| --- | --- | --- |
| `PORT` | `3000` | Puerto HTTP del servidor |

### Endpoints

Las rutas se registran en `src/Router/Login.Route.js` y se montan en `index.js` con el prefijo `/api`.

| Método | Ruta | Descripción | Controlador |
| --- | --- | --- | --- |
| `POST` | `/api/Registrar` | Registra un usuario nuevo | `RegistrarUsuario` |
| `POST` | `/api/Login` | Verifica las credenciales de un usuario | `IniciarSesion` |

Ambos endpoints utilizan `POST` porque reciben datos sensibles como la contraseña, que nunca debe enviarse en la URL.

### Registro de usuarios

`RegistrarUsuario` recibe el cuerpo `User`, `Password` y `Name`, y ejecuta el siguiente flujo:

1. Valida que `User` y `Password` no estén vacíos.
2. Consulta si el usuario ya existe en la tabla `Usuarios`.
3. Genera el hash de la contraseña con `bcrypt` y un salto de 10 rondas.
4. Inserta el nuevo registro.

| Código | Clave | Causa |
| --- | --- | --- |
| `200` | `message` | Registro exitoso |
| `404` | `error` | Faltan campos obligatorios |
| `409` | `error` | El usuario ya existe |
| `500` | `error` | Fallo de consulta o inserción |

Los errores usan la clave `error` y los aciertos `message`. Cada respuesta incluye además `imagen`, que apunta a una imagen de estado publicada por Express bajo el prefijo `/status`.

### Inicio de sesión

`IniciarSesion` recibe el cuerpo `User` y `Password`, busca el usuario y compara la contraseña enviada contra el hash guardado con `bcrypt.compare`.

| Código | Clave | Causa |
| --- | --- | --- |
| `200` | `mensaje` | Credenciales válidas, incluye `User` y `Name` |
| `404` | `mensaje` | Faltan campos obligatorios |
| `401` | `mensaje` | El usuario no existe o la contraseña es incorrecta |
| `500` | `mensaje` | Fallo de consulta o de comparación |

### Imágenes de estado

`src/Utils/StatusImagen.js` relaciona cada escenario de la API con una imagen estática. El frontend las resuelve con el helper `UrlImagen` de `src/services/api.js`.

### Base de datos

La conexión se establece en `src/DataBase/db.js` al iniciar el servidor. Si el archivo `Urban.db` no existe, se crea en la misma carpeta y se genera la tabla `Usuarios` mediante `CREATE TABLE IF NOT EXISTS`.

| Columna | Tipo | Restricciones |
| --- | --- | --- |
| `IDUsuario` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` |
| `User` | `TEXT` | `NOT NULL` |
| `Password` | `TEXT` | `NOT NULL`, contiene el hash generado por `bcrypt` |
| `Name` | `TEXT` | `NOT NULL` |

La contraseña nunca se almacena en texto plano: `src/Utils/PasswordHash.js` genera el salto y el hash con `bcrypt` antes de la inserción.

## Frontend

El frontend es una aplicación SPA construida con React y Vite, sin frameworks de estilos y sin librerías de interfaz de usuario.

### Estructura general

El punto de entrada es `src/main.jsx`, que monta la aplicación dentro de `#root` en modo `StrictMode`. `src/App.jsx` funciona como raíz del árbol de componentes y renderiza `Layouts`, que es el componente encargado de estructurar la página.

La organización separa el componente de layout de los componentes que viven dentro de él:

- `Components/Layouts.jsx`: estructura de la página.
- `Components/Layouts.css`: hoja de estilos compartida.
- `Components/Home/`: componentes de la página.

### Componentes principales

| Componente | Ruta | Descripción |
| --- | --- | --- |
| `App` | `src/App.jsx` | Raíz de la aplicación, renderiza `Layouts` |
| `Layouts` | `src/Components/Layouts.jsx` | Define el shell de la página y el orden de sus secciones |
| `Header` | `src/Components/Home/Header.jsx` | Encabezado con logotipo y menú de navegación |
| `Footer` | `src/Components/Home/Footer.jsx` | Pie de página con información del sitio, enlaces y contacto |
| `RegistroUsuario` | `src/Components/Pages/RegistroUsuario.jsx` | Formulario de alta de usuarios conectado a la API |
| `Main` | `src/Components/Home/Main.jsx` | Formulario de inicio de sesión, aún no montado en el layout |

#### Layouts

`Layouts.jsx` importa `Layouts.css` y compone la página en tres regiones dentro de un contenedor `div.pagina`:

```text
Header
main.contenido
Footer
```

El contenedor aplica `min-height: 100vh` con `display: flex` y `flex-direction: column`. La región de contenido recibe `flex: 1`, por lo que crece hasta ocupar el espacio disponible y empuja el footer hacia abajo de la ventana. Cuando el contenido supera la altura del viewport, la página se desplaza con normalidad y el footer aparece siempre después del contenido, sin superponerse ni tapar ningún elemento.

#### Header

`Header.jsx` renderiza un `header.encabezado` con el logotipo del proyecto y un `nav.menu` con los enlaces Nosotros, Productos, Contactos y Login. Los `href` de los enlaces todavía no apuntan a rutas reales, y el proyecto no incluye un enrutador.

#### Footer

`Footer.jsx` renderiza un `footer.pie` organizado en tres bloques y una barra legal:

- `pie-marca`: nombre del sitio, descripción y enlaces de redes sociales.
- `pie-bloque`: sección de enlaces útiles.
- `pie-bloque`: sección de contacto con correo, teléfono, dirección y horario.
- `pie-legal`: copyright y nota de créditos.

El nombre de la marca, la descripción y los datos de contacto son textos de ejemplo, al igual que los enlaces sociales, y deben reemplazarse por la información definitiva del proyecto.

#### RegistroUsuario

`RegistroUsuario.jsx` renderiza el formulario de alta dentro de `div.contenedorFormulario--registro`, con la imagen del proyecto a la izquierda y el formulario a la derecha. El componente mantiene el estado de los cuatro campos (`User`, `Name`, `Password` y la repetición `Password2`) y trabaja en tres etapas:

1. Valida en el navegador antes de llamar al servidor: usuario y nombre obligatorios, contraseña de al menos 8 caracteres y coincidencia de las dos contraseñas.
2. Envía `User`, `Name` y `Password` a `RegistrarUsuario` y muestra un botón en estado de espera mientras la API responde.
3. Traduce la respuesta en el bloque `.respuesta`, reutilizando los estilos de éxito y error ya definidos en la hoja de estilos, junto con la imagen de estado que devuelve el servidor.

Un `409` marca además el campo de usuario en rojo, porque el conflicto está en ese valor. Al editar el campo marcado, el error se limpia.

La fuerza de la contraseña se calcula en el cliente con un medidor de cuatro segmentos que va del rojo de error al verde de éxito, y un botón permite mostrar u ocultar ambas contraseñas.

#### Main

`Main.jsx` contiene el formulario de inicio de sesión, todavía sin montar en `Layouts.jsx`. Cuando se integre, debería renderizarse dentro de `main.contenido` para ocupar la región central del layout.

### Estilos

Todos los estilos se encuentran centralizados en `src/Components/Layouts.css`. El proyecto utiliza CSS puro, sin Tailwind, Bootstrap, styled-components ni estilos inline, y `src/index.css` se mantiene vacío reservado para estilos globales.

Aspectos destacables de la hoja de estilos:

- Variables CSS definidas por componente para centralizar la paleta, los radios y las transiciones.
- Paleta basada en índigo `#4f46e5` y grises slate, compartida entre el header, el footer y el formulario de registro.
- Modificadores de clase para las variantes de una tarjeta, como `.contenedorFormulario--registro`, que amplían las variables del componente base en lugar de duplicar reglas.
- Flexbox para el layout de página, el encabezado, el menú y el pie.
- CSS Grid para las columnas del footer.
- encabezado fijo con `position: sticky` y efecto de desenfoque con `backdrop-filter`.
- Transiciones en elementos interactivos con `hover` y `focus-visible`.
- Media queries en `900px`, `640px` y `380px` para adaptar el diseño a tablet y celular.
- Soporte para `prefers-reduced-motion` para respetar la preferencia de movimiento reducido del usuario.

### Cómo ejecutar el Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Vite con recarga de módulos |
| `npm run build` | Compila la aplicación en la carpeta `dist` |
| `npm run preview` | Sirve localmente la compilación de producción |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

El archivo `vite.config.js` registra el plugin `@vitejs/plugin-react` y no define proxy ni alias, por lo que el frontend debe consumir la API del backend mediante la URL completa del servidor.

## Pruebas

La carpeta `Testing` contiene las capturas de las pruebas manuales del endpoint de registro: el registro de un usuario nuevo y el rechazo de un usuario ya existente.

El proyecto no incluye pruebas automatizadas. El script `test` del backend no está implementado y el frontend no define script de test.

## Licencia

El backend se encuentra bajo la licencia ISC, según lo declarado en `Server/package.json`.
