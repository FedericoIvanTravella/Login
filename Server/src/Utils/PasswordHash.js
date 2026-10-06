const Encriptar = require('bcrypt')
// --> salto para la encriptación de la contraseña
const Salto=10;
/*
A- 1234
B -1234
*/
// --> async debido a que bcrypt utiliza promesas para generar el hash de la contraseña
const EncriptarPassword=async(Password)=>{
    // --> Generar un hash de la contraseña utilizando bcrypt
    const Seguridad= await Encriptar.genSalt(Salto)
    // --> Retornar el hash de la contraseña
    return await Encriptar.hash(Password,Seguridad)
}

const CompararPassword=async(Password,Hash)=>{
    return await Encriptar.compare(Password,Hash)
}
module.exports={CompararPassword,EncriptarPassword}