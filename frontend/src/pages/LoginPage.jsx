import { useState } from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginReq } from "../api/users"
import { Link, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import toast from "react-hot-toast"
import "./styles/auth-styles.css"
import { logo } from "../ImportImages"

const LoginPage = () => {
 
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginMutation = useMutation({
    mutationFn: loginReq,
    onSuccess: () => {
      toast.success("Inicio de Sesión exitoso!")
      queryClient.invalidateQueries("Publications")
      navigate("/home")
      setLoading(false)
    },
    onError: (error) => {
      toast.error("Hubo un error, intenta de nuevo")
      console.error(error)
      setLoading(false)
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    setLoading(true)
    loginMutation.mutate({ email, password })
  }

  if (loading) { 
    return <div className="loader-content"> <span className="loader"></span> </div>
  }

  return (
    <div className="body">

      <Helmet>
        <title>TecsupNet | Login</title>
      </Helmet>

      <div className="container" id="container">
        <div className="form-container sign">
            <form onSubmit={handleSubmit}>
                <h1 className="form-container--sign">Iniciar sesión</h1>
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email" name="email" id="email" placeholder="nombre.apellido@tecsup.edu.pe" autoComplete="off"/>

                <input 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password" name="password" id="password" placeholder="••••••••" autoComplete='off'/>

                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
        <div className="toggle-container">
            <div className="toggle">
                <div className="toggle-panel toggle-right">
                    <h1>TECSUP NET</h1>
                    <img src={logo} className="toggle-panel-img" />
                    <p>
                      No tienes una cuenta? <Link to={'/register'}>Registrate</Link>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage