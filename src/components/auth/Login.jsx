import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Swal from "sweetalert2"
import clienteAxios from "../../config/axios"

// Context
import { CRMContext } from "../../context/CRMContext"


const Login = () => {

    // Auth y token
    const [auth, setAuth] = useContext(CRMContext);

    

    // State con el objeto credeciales del Usuario
    const [credecianles, setCredecianles] = useState({})

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Navigate para redireccionar
    const navigate = useNavigate()

   

    const handleSubmit = (e) => {
        e.preventDefault(); 

        if ([email, password].includes('')) {
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'Todos los campos son obligatorios'
              })
            return;
        }

        const objetoLogin = {
            email,
            password
        }

        setCredecianles(objetoLogin)

        setPassword('')
        setEmail('')
    }

    const iniciarSesion = async () => {
        try {

            const respuesta = await clienteAxios.post('/iniciar-sesion', credecianles);
            
            // Extraer el token y colocarlo en el LocalStorage
            const { token } = respuesta.data
            localStorage.setItem('token', token);

            // colocar el token Usuario en el State
            setAuth({
                token,
                auth: true
            })

            // alerta succes
            Swal.fire(
                'Login Correcto',
                'Has iniciado Sesión',
                'success'
            )
            
           
            
        } catch (error) {
            if (error.response) {
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: error.response.data.mensaje
                  })
            } else {
                Swal.fire({
                    icon: 'error',
                    type: 'error',
                    title: 'Hubo un error',
                    text: 'Hubo un error'
                  })
            }
        }

    }

    useEffect(() => {
      
        if (Object.keys(credecianles).length > 0 ) {
            iniciarSesion()
        }

    }, [credecianles])

    useEffect(() => {
      
        if (Object.keys(auth.token).length > 0 ) {
            navigate('/')
        }

    }, [auth])
    

    return (
        <div className="login">
            <h2>Iniciar Sesion</h2>

            <div className="contenedor-formulario">
                <form 
                    onSubmit={handleSubmit}
                >

                    <div className="campo">
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email para Iniciar Sesión"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}  
                        />
                    </div>
                    
                    <div className="campo">
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password para Iniciar Sesión"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <input type="submit" value="Iniciar Sesión" 
                        className="btn btn-verde btn-block mt-10"
                    />

                    <Link className="btn_registrar" to={"/registrar"} >No tienes una Cuenta? Registrate</Link>

                </form>
            </div>
        </div>
    )
}

export default Login