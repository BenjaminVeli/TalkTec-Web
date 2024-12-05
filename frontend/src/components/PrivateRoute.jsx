import {Outlet, Navigate} from 'react-router-dom'

const PrivateRoute = () => {

    const user = localStorage.getItem('user_id')

    return (
        user ? <Outlet /> : <Navigate to="/login" replace={true}/> //si user existe muestra las paginas que tienen autenticación y si no redirige al login
    )
}

export default PrivateRoute