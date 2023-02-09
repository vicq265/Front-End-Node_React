import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';



const Producto = ({product}) => {

  const { _id, nombre, precio, imagen} = product;

  const eliminarProducto = id => {
    
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Un producto eliminado no se puede recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

          // Elimnar en rest API
          clienteAxios.delete(`/productos/${id}`)
            .the(res => {
              if (res.status === 200) {
                Swal.fire(
                  'Deleted!',
                    res.data.mensaje,
                  'success'
                )
              }
            })
      }
    })

  }

  return (
    <>
      <li className="producto">
        <div className="info-producto">
          <p className="nombre">{nombre}</p>
          <p className="precio">$ {precio}</p>
          {imagen ? (
            <img src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`} alt={nombre} />
          ) : null}
        </div>
        <div className="acciones">
          <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
            <i className="fas fa-pen-alt"></i>
            Editar Producto
          </Link>

          <button 
              type="button" 
              className="btn btn-rojo btn-eliminar"
              onClick={() => eliminarProducto(_id)}
            >
            <i className="fas fa-times"></i>
            Eliminar Cliente
          </button>
        </div>
      </li>
    </>
  );
};

export default Producto;
