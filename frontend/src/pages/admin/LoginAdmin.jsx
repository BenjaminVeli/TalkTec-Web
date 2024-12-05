import { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import { loginAdmin } from "../../api/users";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import "./../styles/auth-styles.css"

const LoginAdmin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: () => {
      toast.success("Inicio de Sesión exitoso!")
      navigate("/admin-users"); 
    },
    onError: (error) => {
      toast.error("Hubo un error, intenta de nuevo")
      alert(error)
      console.error(error)
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="body">
      <Helmet>
        <title>TecsupNet | Admin Panel - Login</title>
      </Helmet>
      <div className="box">
        <form onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <div className="inputBox">
            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Email</label>
            <i></i>
          </div>
          <div className="inputBox">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
            <label>Contraseña</label>
            <i></i>
          </div>
          <button type="submit" className="button-admin">
            <span>Login</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginAdmin;
