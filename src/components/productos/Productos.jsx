import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Producto from './Producto';
import Spinner from '../layout/Spinner';

// Import axios para hacer la consulta 
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

const Productos = () => {

  // State from produts
  const [productos, setProductos] = useState([]);
  // State para mostrar el Spinner
  const [cargando, setCargando] = useState(true);

  // Utilizar valores del context
  const [auth, setAuth] = useContext(CRMContext);
  const navigate = useNavigate();

  useEffect( () => {

    if (auth.token !== '') {
           
      try {
          
          // Query to the API
          const consultarAPI = async () => {
            const productosConsulta = await clienteAxios.get('/productos', {
                headers : {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            setProductos(productosConsulta.data);
          }

                // Call to the function ConsultAPI
          consultarAPI(); 

      } catch (error) {
            navigate('/iniciar-sesion')
      }
  } else {
      // Redireccionar el Usuario
      navigate('/iniciar-sesion')
  }
    
  } ,[productos])

  setTimeout(() => {
    setCargando(false)
  }, 1000);

  
  return (
    <>
      <h2>Productos</h2>
    
      <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente"> 
          <i className="fas fa-plus-circle"></i>
          Nuevo Producto
      </Link>
    {cargando ? <Spinner/> :  (
      <> 
        <ul className="listado-productos">
          {productos.map(product => (
            <Producto
              key={product._id} 
              product={product}
            />
          ))}
        </ul>
      </>
    )}
      
    </>
  )
}

export default Productos