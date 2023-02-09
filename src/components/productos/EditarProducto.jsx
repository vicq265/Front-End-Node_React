import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

const EditarProducto = () => {
  // Utilizar valores del context
  const [auth, setAuth] = useContext(CRMContext);
  
  // Datos product obtenidos de la base de datos
  const [datosProducto, setDatosProducto] = useState({});

  const [nameProducto, setNameProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  
  // State para el archivo(Imagen)
  const [archivo, setArchivo] = useState('');

  // State que almacenara el Producto Editado
  const [productEditado, setProductEditado] = useState({})

  // Obtener el ID del producto
  const { id } = useParams();

  // istanciando useNavigate
  const navigate = useNavigate()

  // Consultrar la API parar traer el producto a editar
  const consultarAPI = async () => {
    const productoConsulta = await clienteAxios.get(`/productos/${id}`,{
      headers : {
        Authorization: `Bearer ${auth.token}`
      }
    })
    setDatosProducto(productoConsulta.data)
  }

  useEffect(() => {
    consultarAPI();
  },[])

  // Extraer los valores del state
  const {nombre, precio, imagen} = datosProducto;
  
  useEffect(() => {
    if(Object.keys(datosProducto).length > 0 ){
        
        setNameProducto(nombre);
        setPrecioProducto(precio);
        setArchivo(imagen);
      }
    
  }, [datosProducto])


  const handleSubmit = e => {
      e.preventDefault()

      // Validacion del formulario
      if ([nameProducto, precioProducto].includes("")) {
        Swal.fire({
          type: 'error',
          title: 'Hubo un error',
          text: 'Todos los campos son obligatorios'
        })
        return;
      }

      const objetoProductEditado = {
        nombre: nameProducto,
        precio: precioProducto,
        imagen: archivo
      }

      setProductEditado(objetoProductEditado)
  }

  const actulizarProducto = async () => {

    // Crear un FormData
    const formData = new FormData();
    formData.append('nombre', nameProducto);
    formData.append('precio', precioProducto);
    formData.append('imagen', archivo);

    // Almacenar en la base de datos
    try {
      const res = await clienteAxios.put(`/productos/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`
          }
        });
        if (res.status === 200) {
            Swal.fire(
              'Editado Correctamente',
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

  useEffect(() => {

    if (Object.keys(productEditado).length > 0) {
        actulizarProducto();
    }

  },[productEditado])

  // Verificar si el usuario esta autenticado o no 
  if(!auth.auth && (localStorage.getItem('token') === auth.token) ){
    navigate("/")
  }

  return (
    <>
      <h1>Editar Producto</h1>

      <form 
      
        onSubmit={handleSubmit}
      >
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

              {imagen ? (
                <img src={`http://localhost:5000/${imagen}`} alt={`${nombre}`} width="200" />
              ) : null}

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
                      value="Guardar Cambios" 
                   />
          </div>
      </form>
    </>
  )
}

export default EditarProducto
