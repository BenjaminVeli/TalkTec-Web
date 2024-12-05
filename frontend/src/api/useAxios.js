import axios from "axios"
import jwt_decode from "jwt-decode"

export const baseURL = "http://127.0.0.1:8000/"

export const axi = axios.create({
    baseURL,
})

export const authAxios = axios.create({
    baseURL,
    withCredentials: true,
})

// Interceptor de solicitudes para agregar el token de acceso a las solicitudes autenticadas
authAxios.interceptors.request.use(async (config) =>{
    const access = localStorage.getItem('access')

    // Configuración del encabezado de autorización
    config.headers = {
        Authorization: `Bearer ${access}`, 
    }

    const decoded = jwt_decode(access)

    const exp = new Date(decoded.exp * 1000)
    const now = new Date()
    const five = 1000 * 60 * 5

    // Comprobar si el token de acceso está a punto de caducar
    if(exp.getTime() - now.getTime() < five) {

        try {
            // Obtener un nuevo token de acceso utilizando el token de actualización
            const oldrefresh = localStorage.getItem('refresh')
            const res = await axi.post('/users/refresh/', { oldrefresh })
            const { access, refresh } = res.data
    
            localStorage.setItem('access', access)
            localStorage.setItem('refresh', refresh)

        } catch(err) {
             // Limpiar el almacenamiento local y redirigir a la página de inicio de sesión en caso de error
            localStorage.clear()
            window.location.href = '/login'
        }

    } else {
        console.log('El token sigue estando valido')
        return config
    }
    return config
})