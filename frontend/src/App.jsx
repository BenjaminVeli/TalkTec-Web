import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"


import Layout from "./components/Layout"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import UserProfilePage from "./pages/UserProfilePage"
import SoloPostPage from "./pages/SoloPostPage"
import DegreePage from "./pages/DegreePage"

import LoginAdmin from "./pages/admin/LoginAdmin"
import PublicationsAdmin from "./pages/admin/PublicationsAdmin"
import UsersAdmin from "./pages/admin/UsersAdmin"
import ReportsAdmin from "./pages/admin/ReportsAdmin"

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>
          {/* Nesecitan estar autenticados para acceder a estas paginas: */}
          <Route element={<PrivateRoute />}>
            <Route  path="/home" element={<HomePage />} />
            <Route path="/publication/:id" element={<SoloPostPage />} />
            <Route path="/degree/:degreeId" element={<DegreePage />} /> {/* Esta es la ruta para las carreras, puedes modificarla para que sea mediante el id de degree o algo asi */}
            <Route path="/:name" element={<UserProfilePage />} />
          </Route>
          
        </Route>

        {/* Si no estan autenticados: */}
        <Route index element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<LoginAdmin />} />

        {/* Nesecita la autenticados de administrador para acceder a estas paginas: */}
        <Route element={<AdminRoute />}>
          <Route path="/admin-users" element={<UsersAdmin />} />
          <Route path="/admin-publications" element={<PublicationsAdmin />}/>
          <Route path="/admin-reports" element={<ReportsAdmin />}/>
        </Route>


      </Routes>
    </BrowserRouter>
  )
}

export default App
