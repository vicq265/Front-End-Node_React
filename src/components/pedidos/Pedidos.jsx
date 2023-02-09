import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';
import DetallesPedido from './DetallesPedido';


const Pedidos = () => {
    // Utilizar valores del context
    const [auth, setAuth] = useContext(CRMContext);
    const navigate = useNavigate();
  

    const [pedidos, setPedidos] = useState([]);


    
    useEffect(() => {

      if (auth.token !== '') {
        try {
          
          const consultarAPI = async () => {
            // Obtener los pedidos
            const  resultado = await clienteAxios.get('/pedidos', {
              headers : {
                Authorization: `Bearer ${auth.token}`
              }
            });
            
            setPedidos(resultado.data);
          }

          consultarAPI();
        } catch (error) {
          navigate('/iniciar-sesion')
        }
        
      }else {
        navigate('/iniciar-sesion')
      }

    }, [pedidos])
    const eliminarPedido = (id) => {
        
      Swal.fire({
          title: '¿Estas seguro?',
          text: "Un pedido eliminado no se puede recuperar",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Eliminar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            // Llamado axios
            clienteAxios.delete(`/pedidos/${id}`, {
              headers : {
                Authorization: `Bearer ${auth.token}`
              }
            })
              .then( res => {
                Swal.fire(
                    'Eliminado!',
                    res.data.mensaje,
                    'success'
                );
              })
          }
        })
      }

      // Verificar si el usuario esta autenticado o no 
      if(!auth.auth && (localStorage.getItem('token') === auth.token) ){
        navigate("/")
      }

    return (
        <>
          <h2>Pedidos</h2>

          <ul className="listado-pedidos">
              {pedidos.map(pedido => (
                <DetallesPedido
                  key={pedido._id}
                  pedido={pedido}
                  eliminarPedido={eliminarPedido}
                />
              ))}
              
          </ul>
        </>
    )
}

export default Pedidos