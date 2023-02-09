import { Fragment, useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import clienteAxios from "../../config/axios"
import Spinner from "../layout/Spinner"
import Cliente from "./Cliente"


// Import el Context 
import { CRMContext } from "../../context/CRMContext"


const Clientes = () => {
    
    // Uso de use navigate para redireccionar
    const navigate = useNavigate()
    
    // Trabajar con el state 
    const [clientes, setGuardarClientes] = useState([])
    // State para mostrar el Spinner
    const [cargando, setCargando] = useState(true);

    // Utilizar valores del context
    const [auth, setAuth] = useContext(CRMContext);

    const consultarAPI = async () => {
        if (auth.token !== '') {
           
            try {
                
                // Query a la API
                const clientesConsulta = await clienteAxios.get('/clientes', {
                    headers : {
                        Authorization: `Bearer ${auth.token}`
                    }
                });

                // Colocar el resultado en el State
                setGuardarClientes(clientesConsulta.data)

            } catch (error) {
                console.log(error);
                // Error con la autorizacion
                if(error.response.status === 500) {
                    // Redireccionar el Usuario
                    navigate('/iniciar-sesion')
                }
            }
        } else {
            // Redireccionar el Usuario
            navigate('/iniciar-sesion')
        }
        
    }

    if (!auth.auth) {
        navigate('/iniciar-sesion');
    }

    // Use effect es similar componentdidmount y willmount
    useEffect(() => {
      consultarAPI()
    }, [clientes])

    setTimeout(() => {
        setCargando(false)
      }, 1000);
    
    return (
        <Fragment>
            <h2>Clientes</h2>
            <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>

            {cargando ? <Spinner/> :  (
                <>
                    <ul className="listado-clientes">
                        {clientes.map( cliente => (
                            <Cliente 
                                key={cliente._id} 
                                cliente={cliente}
                            />
                        ) )}
                    </ul>
                </>
            )}
            
        </Fragment>
    )
}

export default Clientes