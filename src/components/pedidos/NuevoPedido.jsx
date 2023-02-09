import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";
import BuscadorProducto from "./BuscadorProducto";
import FormCantidadProductos from "./FormCantidadProductos";


const NuevoPedido = () => {
    
    const [auth, setAuth] = useContext(CRMContext);

    // State cliente
    const [cliente, setCliente] = useState({});
    // Guardar la busqueda del form
    const [busqueda, setBusqueda] = useState('');
    // State para almacenar los productos de la busqueda
    const [productos, setProductos] = useState([]);
    // state para calcular
    const [total, setTotal] = useState(0)


    // Extraer ID  del cliente
    const { id } = useParams();
    const navigate = useNavigate()
    


    useEffect(() => {
        // Obtener el cliente
        const consultarAPI = async () => {
        // Consultar el cliente Actual
        const resultado = await clienteAxios.get(`/clientes/${id}`, {
            headers : {
              Authorization: `Bearer ${auth.token}`
            }
          });
        setCliente(resultado.data);
        };

        consultarAPI();
    }, []);

    const buscarProducto = async (e) => {
        e.preventDefault();

        // Obtener los productos de la busqueda
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`, {
            headers : {
              Authorization: `Bearer ${auth.token}`
            }
          });
        
        // Si no hay resultado una alerta, contrario agregarlo al State
        if (resultadoBusqueda.data[0]) {


            let productoResultado = resultadoBusqueda.data[0];

            // Agregar la llave "Producto" (copia de id)
            productoResultado.producto = resultadoBusqueda.data[0]._id;
            productoResultado.cantidad = 0;

            // Ponerlo en el state
            setProductos([...productos, productoResultado])
            

        } else {
            // No hay resultado
            Swal.fire({
                icon: 'error',
                type: 'error',
                title: 'No Resultados',
                text: 'No hay resultados'
            })
        }

    };

    // Almacenar una busqueda en el State
    const leerDatosBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    // Actualizar la cantidad de productos
    const restarProductos = (i) => {
        // copiar el arreglo original de productos
        const todosProductos = [...productos];

        // Validar si esta en cero no seguir restando
        if(todosProductos[i].cantidad === 0) return;

        // decrementar
        todosProductos[i].cantidad --;

        // Almacenarlo el state
        setProductos(todosProductos);
    }


    const aumentarProducto = (i) => {
        // copiar el arreglo original de productos
        const todosProductos = [...productos];

        // Incremento
        todosProductos[i].cantidad ++;

        // Almacenarlo el state
        setProductos(todosProductos);
        console.log(productos);
    }

    // Actualizando el total a pagar
    useEffect(() => {
        actualizarTotal()
    },[productos])

    // Elimina un producto del state
    const eliminarProductoPedido = (id) => {
        const todosProductos = productos.filter(producto => producto._id !== id);

        setProductos(todosProductos);
    }

    // Actualizar el total a pagar
    const actualizarTotal = () => {

        // si el arreglo de productos es igual 0: el total es 0
        if (productos.length === 0){
            setTotal(0)
            return;
        }

        // Calcular el nuevo total
        let nuevoTotal = 0;

        // recorrer todos los productos, parar obter sus cantidades y precios
        productos.map( producto => nuevoTotal += (producto.cantidad * producto.precio) );

        // Almacenar en el total
        setTotal(nuevoTotal)

    }

    const handlePedido = async (e) => {
        e.preventDefault();

        // Extraer el ID

        const pedido = {
            "cliente": id,
            "pedido" : productos,
            "total": total
        }

        // Almacenar en la BD
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido, {
            headers : {
              Authorization: `Bearer ${auth.token}`
            }
          });

        // Leer resultado
        if (resultado.status === 200) {
            // Alerta todo bien
            Swal.fire(
                'Correcto',
                resultado.data.mensaje,
                'success'
              )
        } else {
            // Alert de error
            Swal.fire({
                icon: 'error',
                title: 'Hubo un Error',
                text: 'Vuelve a intentarlo'
            })
        }

        // Redireccionar
        navigate('/clientes')

    }

    // Verificar si el usuario esta autenticado o no 
    if(!auth.auth && (localStorage.getItem('token') === auth.token) ){
        navigate("/")
    }

    return (
        <>
        <h2>Nuevo Pedido</h2>

        <div className="ficha-cliente">
            <h3>Datos de Cliente</h3>
            <p>
            Nombre: {cliente.nombre} {cliente.apellido}
            </p>
            <p>Teléfono: {cliente.telefono}</p>
        </div>

        <BuscadorProducto
            buscarProducto={buscarProducto}
            leerDatosBusqueda={leerDatosBusqueda}
        />

        <ul className="resumen">
            {productos.map((producto, index) => (
                <FormCantidadProductos
                    key={producto.producto}
                    producto={producto}
                    restarProductos={restarProductos}
                    aumentarProducto={aumentarProducto}
                    eliminarProductoPedido={eliminarProductoPedido}
                    index={index}
                />
            ))}
        </ul>

        <p className="total">Total a Pagar: <span>$ {total}</span></p>
            {total > 0 ? (
                <form 
                    onSubmit={handlePedido}
                >
                    <input
                        type="submit"
                        className="btn btn-verde btn-block"
                        value="Realizar Pedido"
                    />
                </form>

            ) : null}
        </>
    );
};

export default NuevoPedido;
