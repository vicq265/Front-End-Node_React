import { createContext, useContext, useState } from 'react'


const CRMContext = createContext([ {}, () => {}]);

const CRMProvider = props => {

    // Definir el state Inicial
    const [auth, setAuth] = useState({
        token: '',
        auth: false
    })

    return(
        <CRMContext.Provider value={[auth, setAuth]}>
            {props.children}
        </CRMContext.Provider>
    )
    
}

export {
    CRMContext,
    CRMProvider
}
