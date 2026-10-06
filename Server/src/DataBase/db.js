const Ubicacion= require('path')
const SQLite3=require('sqlite3')

// --> resolve: se encarga de unir rutas de archivos y carpetas
const DataBase_Ubicacion= Ubicacion.resolve(__dirname,'./Urban.db')

const ConexionBD= new SQLite3.Database(DataBase_Ubicacion,(error)=>{
    if(error){
        console.error('No se pudo crear correctamente la Base de Datos',error)
    }
    else{
        console.log('Base de Datos creada Correctamente ✅')
        ConexionBD.exec(
            `CREATE TABLE IF NOT EXISTS Usuarios(
                IDUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
                User TEXT NOT NULL,
                Password TEXT NOT NULL,
                Name TEXT NOT NULL,
                Descripcion TEXT NOT NULL,
                Stock INTEGER NOT NULL,
                Precio FLOAT NOT NULL
                Imagen TEXT NOT NULL 
            )`,(error)=>{
                if(error){
                    console.error('Error al Crear la Tabla Usuarios ⛔',error.message)
                }
                else{
                    console.log('Tabla Productos creada Correctamente ✅')
                }
            }
        )
    }
})

module.exports={ConexionBD}