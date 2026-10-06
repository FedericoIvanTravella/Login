import React from 'react'
import Header from './Home/Header'
import './Layouts.css'
import Footer from './Home/Footer'
// import Main from './Home/Main'
// import { RegistrUsuario } from '../Components/Pages/RegistroUsuario'
import RegistroUsuario from './Pages/RegistroUsuario'

function Layouts() {
  return (
    <div className="pagina">
        <Header />
        <RegistroUsuario />
          
        
        <Footer />
    </div>
  )
}

export default Layouts