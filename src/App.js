import { Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";


/** LAYOUT */
import Header from "./components/layout/Header";
import Navegacion from "./components/layout/Navegacion";

// Context 
import { CRMContext, CRMProvider } from './context/CRMContext';


function App() {
    // utilizar context en ek Componenete
    const [auth, setAuth ] =  useContext(CRMContext)

    return (
      <Fragment>
          <CRMProvider value={[auth, setAuth]} >
            <Header/>

            <div className="grid contenedor contenido-principal">
              <Navegacion />

              <main className="caja-contenido col-9">
                
                <Outlet />

              </main>
            
            </div>


          </CRMProvider>

      </Fragment>
    );
}

export default App;
