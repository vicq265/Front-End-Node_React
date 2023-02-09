import { useContext, useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

// Import el Context 
import { CRMContext } from "../../context/CRMContext"

const NuevoCliente = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const [cliente, setCliente] = useState({});

   // Utilizar valores del context
   const [auth, setAuth] = useContext(CRMContext);

  // Para redireccionar
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validacion del formulario
    if ([nombre, apellido, empresa, email, telefono].includes("")) {
      Swal.fire({
        type: 'error',
        title: 'Hubo un error',
        text: 'Todos los campos son obligatorios'
      })
      return;
    }

    const expression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

    if (!expression.test(email)) {
      Swal.fire({
        type: 'error',
        title: 'Hubo un error',
        text: 'El email no es valido'
      })
    }

    // Objeto de paciente
    const objetoPaciente = {
      nombre,
      apellido,
      empresa,
      email,
      telefono,
    };

    // Nuevo registro
    setCliente(objetoPaciente);

    // Reiniciar el formulario
    setNombre("");
    setApellido("");
    setEmpresa("");
    setEmail("");
    setTelefono("");
    // setCliente({})
  };

  const registrarCliente = async () => {
    
    try {
      // Enviar petición
      clienteAxios.post('/clientes', cliente,{
        headers : {
          Authorization: `Bearer ${auth.token}`
        }
      })
        .then(res =>{
          // validar si hay errores de mongo
          if (res.data.code === 11000) {
  
            Swal.fire({
              icon: 'error',
              type: 'error',
              title: 'Hubo un error',
              text: 'Ese cliente ya esta registrado'
            })
          }else {
            console.log(res.data);
            Swal.fire(
              'Se agrego el Cliente',
              res.data.mensaje,
              'success'
            )
          }
          navigate("/")
        })
      
    } catch (error) {
      console.log(error);
    }
    
  }

  useEffect(() => {

    if (Object.keys(cliente).length > 0) {

      registrarCliente();

    }
  }, [cliente]);
  
  // Verificar si el usuario esta autenticado o no 
  if(!auth.auth && (localStorage.getItem('token') === auth.token) ){
    navigate("/")
  }

  return (
    <>
      <h2>Nuevo Cliente</h2>

      <form onSubmit={handleSubmit}>
        <legend>Llena todos los campos</legend>
        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Cliente"
          />
        </div>
      </form>
    </>
  );
};

export default NuevoCliente;
