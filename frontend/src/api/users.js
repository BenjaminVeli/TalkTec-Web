import { axi, authAxios } from "./useAxios"
import jwt_decode from "jwt-decode"

// Función para buscar un usuario
export const q = async (query) => {
    const res = await authAxios.get(`/users/u/search/?query=${query}`)
    return res.data
}

// Función para actualizar el perfil del usuario
export const updateProfile = async (data) => {
    await authAxios.put(`/users/${localStorage.getItem('name')}/`, data)
}

// Función para obtener el perfil de un usuario específico
export const userProfile = async (name) => {
    // console.log(`/users/${name}/`)
    const res = await authAxios.get(`/users/${name}/`)
    return res.data
}

// Función para cerrar sesión
export const logout = () => {
    localStorage.clear()
    window.location.href = '/login'
} 

export const registerReq = async (code, email, name, last_name, degree, password) => {
    await axi.post('/users/register/', {code, email, name, last_name, degree, password})
}

// Función para hacer una solicitud de inicio de sesión
export const loginReq = async (data) => {
    const res = await axi.post('/users/login/', data)
    console.log(res.data)

    const { access, refresh } = res.data

    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)

    const user = jwt_decode(localStorage.getItem('access'))

    localStorage.setItem('name', user.name)
    localStorage.setItem('last_name', user.last_name)
    localStorage.setItem('degree', user.degree)
    localStorage.setItem('user_id', user.user_id)
    localStorage.setItem('avatar', user.avatar)
}


// -------------------------------- Logic for user administrator  --------------------------------

export const loginAdmin = async (data) => {
    try {
        const res = await axi.post('/users/login/', data);
        console.log(res.data);

        const { access, refresh } = res.data;

        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        // Decodificar el token para obtener información del usuario
        const user = jwt_decode(access);

        // Verificar si el usuario tiene is_staff activado
        if (!user.is_staff) {
            throw new Error("No tienes permisos de administrador para acceder.");
        }

        // Si el usuario tiene is_staff, guarda los datos en localStorage
        localStorage.setItem('name', user.name);
        localStorage.setItem('last_name', user.last_name);
        localStorage.setItem('degree', user.degree);
        localStorage.setItem('user_id', user.user_id);
        localStorage.setItem('avatar', user.avatar);
        localStorage.setItem('is_staff', user.is_staff);

    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error("Las credenciales son incorrectas.");
        } else {
            throw error; // Lanza el error original si no es 401
        }
    }
};

export const logoutAdmin = () => {
    localStorage.clear()
    window.location.href = '/admin-login'
} 

export const getUsersList = async (params) => {
    const res = await authAxios.get('/adminapi/users-list/', { params });
    return res.data;
}

export const putUserList = async (userId, updatedData) => {
    const res = await authAxios.patch(`/adminapi/users-update/${userId}/`, updatedData);
    return res.data;
}

export const getUsersCount = async () => {
    const res = await authAxios.get('/adminapi/users-count/');
    return res.data;
}

export const getWeeklyUserRegistrations = async () => {
    const res = await authAxios.get('/adminapi/weekly-users/');
    return res.data;
}

  