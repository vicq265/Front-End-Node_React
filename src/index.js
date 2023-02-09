import React from 'react';
// Routing
import { createBrowserRouter, RouterProvider} from "react-router-dom";

import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';


/** Components CLIENTES */
import Clientes from "./components/clientes/Clientes";
import NuevoCliente from './components/clientes/NuevoCliente';
import EditarCliente from './components/clientes/EditarCliente';

/** Components PRODUCTS */
import Productos from "./components/productos/Productos";
import EditarProducto from './components/productos/EditarProducto';
import NuevoProducto from './components/productos/NuevoProducto';

/** Components PEDIDOS */
import Pedidos from "./components/pedidos/Pedidos";
import NuevoPedido from './components/pedidos/NuevoPedido';

/** Components Usuarios */
import Login from './components/auth/Login';
import Registrar from './components/auth/Registrar';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        index: true,
        element: <Clientes/>
      },
      // rutas clientes
      {
        path: "/clientes",
        element: <Clientes/>
      },

      {
        path: "/clientes/nuevo",
        element: <NuevoCliente/>
      },
      {
        path: "/clientes/editar/:id",
        element: <EditarCliente />
      },
      // rutas productos
      {
        path: "/productos",
        element: <Productos/>,
      },
      {
        path: "/productos/nuevo",
        element: <NuevoProducto/>,
      },
      {
        path: "/productos/editar/:id",
        element: <EditarProducto/>,
      },
      // rutas pedidos
      {
        path: "/pedidos",
        element: <Pedidos/>
      },
      {
        path: "/pedidos/nuevo/:id",
        element: <NuevoPedido/>
      },
      // rutas usuario
      {
        path: "/iniciar-sesion",
        element: <Login />
      },
      {
        path: "/registrar",
        element: <Registrar />
      },

    ]
  },
  
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
