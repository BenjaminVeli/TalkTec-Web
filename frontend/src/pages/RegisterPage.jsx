import { useEffect, useState } from 'react'
import { useMutation } from "@tanstack/react-query"
import { registerReq } from "../api/users"
import { Link, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { toast } from "react-hot-toast"
import "./styles/auth-styles.css"
import { axi } from "../api/useAxios"
import { logo } from "../ImportImages"

const RegisterPage = () => {
    // Declaración de variables de estado y funciones de control
    const navigate = useNavigate()

    // Variables de estado para datos del formulario
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState("")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [last_name, setLastName] = useState("")
    const [degree, setDegree] = useState("")
    const [password, setPassword] = useState("")
    const [re_password, setRePassword] = useState("")

    // useEffect para obtener la lista de departamentos al cargar la página
    useEffect(() => {
    // Realiza una solicitud para obtener la lista de carreras desde Django
        axi.get('/users/departments/') // ruta relativa
        .then((response) => {
            setDepartments(response.data) // Almacena la lista de departamentos en el estado
        })
        .catch((error) => {
            console.error(error)
        })
    }, [])

    const registerMutation = useMutation({
        mutationFn: () => registerReq(code, email, name, last_name, degree, password),
        onSuccess: () => {
            toast.success("Registro exitoso!")
            navigate("/login")
            setLoading(false)
            console.log("registerMutation success")
        },
        onError: (error) => {
            toast.error("Hubo un error, intenta de nuevo")
            console.error(error)
            setLoading(false)
        }
    })

    const handleMatch = () => {
        if (password !== re_password) {
          return false
        } else {
          return true
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (password !== re_password) {
            toast.error("Las contraseñas deben coincidir")
        } else {
            setLoading(true)
            registerMutation.mutate() // Inicia la solicitud de registro del usuario
        }
    }

    if (loading) { 
        return <div className="loader-content"> <span className="loader"></span> </div>
    }

    return (
      <div className="body">
        <Helmet>
          <title>TecsupNet | Register</title>
        </Helmet>
        <div className="container" id="container">
  
          <div className="form-container sign" onSubmit={handleSubmit}>
            <form>
                <h1 className="form-container--sign">Regístrate</h1>
                
                <input
                value={code}
                onChange={(e) => setCode(e.target.value)} 
                type="code" name="code" id="code" placeholder="Código de alumno" autoComplete="off" required/>
  
                <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
                type="email" name="email" id="email" placeholder="nombre.apellido@tecsup.edu.pe" autoComplete="off" required/>
  
                <input 
                value={name}
                onChange={(e) => setName(e.target.value)}  
                type="name" name="name" id="name" placeholder="Nombres" autoComplete="off" required/>
  
                <input
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}   
                type="last_name" name="last_name" id="last_name" placeholder="Apellidos" autoComplete="off" required/>
  
                <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                name="degree"
                id="degree"
                required
                >
                  <option value="">Selecciona una carrera</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name_depart}
                    </option>
                  ))}
                </select>
  
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}   
                  type="password" name="password" id="password" placeholder="••••••••" autoComplete="off" required/>    
  
                <input
                  value={re_password}
                  onChange={(e) => setRePassword(e.target.value)}   
                  type="password" name="re-password" id="re-password" placeholder="••••••••" autoComplete="off" required/>
  
                { handleMatch() ? null : (<p className="handleMatch">Las contraseñas deben coincidir</p>) }
  
                <button type="submit" >Registrate</button>
            </form>
          </div>
  
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-right">
                <h1>TECSUP NET</h1>
                <img src={logo} className="toggle-panel-img" />
                <p>¿Tiene una cuenta? <Link to={'/login'}>Iniciar sesión</Link></p>
              </div>
            </div>
          </div>
  
        </div>
  
      </div>
    )
}

export default RegisterPage