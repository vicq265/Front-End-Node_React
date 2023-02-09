import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';

const Registrar = () => {
    const [usuario, setUsuario] = useState({});
    
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Redireccionar
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();

        if ([nombre, email, password].includes('')) {
            Swal.fire({
                icon: 'error',
                type: 'error',
                title: 'Hubo un error',
                text: 'Todos los campos son Obligatorios'
              })

              return;
        }

        const objetoUsuario = {
            nombre,
            email,
            password
        }

        setUsuario(objetoUsuario)
    }

    const registrarUsuario = async() => {

        try {
            // Hacer Petecion con AXIOS
            await clienteAxios.post('/crear-cuenta', usuario)
            .then(res => {
                if(res.status === 200){
                    Swal.fire(
                        'Usuario',
                        'Usuario Creado Correctamente',
                        'success'
                    )
                }
            })

            
            navigate('/iniciar-sesion')
            
        } catch (error) {
            console.log(error);
            if (error.response) {
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: error.response.data.mensaje
                  })
            } 
        }

    }

    useEffect(() => {

        if (Object.keys(usuario).length > 0) {
            registrarUsuario()
        }

    }, [usuario])


    return (
    <div className="login">
        <h2>Registro</h2>

        <div className="contenedor-formulario">
            <form 
                onSubmit={handleSubmit}
            >

                <div className="campo">
                    <label htmlFor="nombre">Nombre</label>
                    <input 
                        id="nombre"
                        type="text"
                        name="nombre"
                        placeholder="Escriba su Nombre"
                        // required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}  
                    />
                </div>
                <div className="campo">
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Escriba su Email"
                        // required
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
                        placeholder="Escriba su Password"
                        // required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <input type="submit" value="Registrar" 
                    className="btn btn-verde mt-10 btn-block"
                />

                <Link className="btn_registrar " to={"/iniciar-sesion"} >Tienes una Cuenta? Inicia Sesión</Link>

            </form>
        </div>
    </div>
  )
}

export default Registrar