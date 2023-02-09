import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";


const NuevoProducto = () => {
  const navigate = useNavigate();
  // State Product
  const [producto, setProducto] = useState({});
  
  const [nameProducto, setNameProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');

  // State para el archivo(Imagen)
  const [archivo, setArchivo] = useState('');

  // Utilizar valores del context
  const [auth, setAuth] = useContext(CRMContext);
  

  // Leer los datos del formulario
  const handleSubmit = e => {
    e.preventDefault();

    // Validacion del formulario
    if ([nameProducto, precioProducto, archivo].includes("")) {
      Swal.fire({
        type: 'error',
        title: 'Hubo un error',
        text: 'Todos los campos son obligatorios'
      })
      return;
    }

    const objetoProduct = {
      nombre: nameProducto,
      precio: precioProducto,
      imagen: archivo
    }

    setProducto(objetoProduct)

  }

  const agregarProducto = async () => {

    // Crear un FormData
    const formData = new FormData();
    formData.append('nombre', nameProducto);
    formData.append('precio', precioProducto);
    formData.append('imagen', archivo);

    // Almacenar en la base de datos
    try {
      const res = await clienteAxios.post('/productos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`
          }
        });
        if (res.status === 200) {
            Swal.fire(
              'Agregado correctamente',
              res.data.mensaje,
              'success'
            )
        }

        setNameProducto('')
        setArchivo('')
        setPrecioProducto('')

        navigate('/productos')

    } catch (error) {
      console.log(error);
      // Enviar una alerta de error
      Swal.fire({
        type: 'error',
        title: 'Hubo un error',
        text: 'Vuelve a intentarlo'
      })
    }

  }

  // Agregar Producto cada que el State de Product haga un cambio
  useEffect(() => {

    if (Object.keys(producto).length > 0) {
        agregarProducto();
    }

  }, [producto])
  

   // Verificar si el usuario esta autenticado o no 
   if(!auth.auth && (localStorage.getItem('token') === auth.token) ){
    navigate("/")
  }

  return (

    <>
      <h2>Nuevo Producto</h2>

      <form onSubmit={handleSubmit}>
          <legend>Llena todos los campos</legend>

          <div className="campo">
              <label>Nombre:</label>
              <input 
                  type="text" 
                  placeholder="Nombre Producto" 
                  name="nombre"
                  value={nameProducto}
                  onChange={(e) => setNameProducto(e.target.value)}
               />
          </div>

          <div className="campo">
              <label>Precio:</label>
              <input 
                  type="number" 
                  name="precio" min="0.00" step="0.01"
                  placeholder="Precio"
                  value={precioProducto}
                  onChange={(e) => setPrecioProducto(e.target.value)} 
               />
          </div>

          <div className="campo">
              <label>Imagen:</label>
              <input 
                  type="file"  
                  name="imagen"
                  accept="image/png, image/jpeg"
                  
                  onChange={e => setArchivo(e.target.files[0])} 
                />
          </div>

          <div className="enviar">
                  <input 
                      type="submit" 
                      className="btn btn-azul" 
                      value="Agregar Producto" 
                   />
          </div>
      </form>

    </>
  )
}

export default NuevoProducto
