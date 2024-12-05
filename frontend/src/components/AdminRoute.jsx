import {Outlet, Navigate} from 'react-router-dom'

const AdminRoute = () => {

    const useradmin = localStorage.getItem('is_staff')

    return (
        useradmin ? <Outlet /> : <Navigate to="/admin-login" replace={true}/> //si user existe muestra las paginas que tienen autenticación y si no redirige al login
    )
}

export default AdminRoute