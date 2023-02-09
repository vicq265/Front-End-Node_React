import { useContext, useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

const EditarCliente = () => {

    // Utilizar valores del context
    const [auth, setAuth] = useContext(CRMContext);

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");

    const [datosCliente, setDatosCliente] = useState({});
    const [clienteActualizado, setClienteActualizado] = useState({})

    // Para redireccionar
    const navigate = useNavigate();
  
    // Obtener el Id
    const { id } = useParams();

    // Query a la Api
    const consultarAPI = async () => {
        const clienteConsulta = await clienteAxios.get(`/clientes/${id}`,{
          headers : {
            Authorization: `Bearer ${auth.token}`
          }
        });
        // Colocar en el State
        setDatosCliente(clienteConsulta.data)
    }
    
    // useEffect, cuando el Componente carga 
    useEffect(() => {
        consultarAPI()
    }, []);

    // Aqi escuchamos por los cambios del state Paciente (Editar)
    useEffect(() => {
        if(Object.keys(datosCliente).length > 0 ){
            
            setNombre(datosCliente.nombre);
            setApellido(datosCliente.apellido);
            setEmpresa(datosCliente.empresa);
            setEmail(datosCliente.email);
            setTelefono(datosCliente.telefono);
        }
      
    }, [datosCliente])

    // Envio de datos atraves de onSubmit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validacion del formulario
        if ([nombre, apellido, empresa, email, telefono].includes("")) {
          Swal.fire({
            icon: 'error',
            type: 'error',
            title: 'Hubo un error',
            text: 'Todos los campos son obligatorios'
          })
          return;
        }

        const expression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

        if (!expression.test(email)) {
          console.log("Email not valid");
        }

        // Objeto de paciente
        const objetoPaciente = {
          nombre,
          apellido,
          empresa,
          email,
          telefono
        };

        // Nuevo registro
        setClienteActualizado(objetoPaciente);

        // Reiniciar el formulario
        setNombre("");
        setApellido("");
        setEmpresa("");
        setEmail("");
        setTelefono("");
    };

    useEffect(() => {

        if (Object.keys(clienteActualizado).length > 0) {
          // Enviar petición
          clienteAxios.put(`/clientes/${id}`, clienteActualizado, {
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
                    'Correcto',
                    'Se actualizo Correctamente',
                    'success'
                    )
                }
                navigate("/")  
            })
        }

    }, [clienteActualizado]);

    // Verificar si el usuario esta autenticado o no 
    if(!auth.auth && (localStorage.getItem('token') === auth.token) ){
      navigate("/")
    }

  return (
    <>
      <h2>Editar Cliente</h2>

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
            value="Guardar Cambios"
          />
        </div>
      </form>
    </>
  );
};

export default EditarCliente;
