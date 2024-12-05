import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { userProfile } from "../api/users"   
import { getUserPublications } from "../api/publication"
import { Helmet } from "react-helmet"
import { IoMdCalendar } from "react-icons/io"
import { useState } from "react"
import EditProfile from "../components/EditProfile"
import MyPosts from "../components/MyPosts"
import MyLikes from "../components/MyLikes"
import MyMedia from "../components/MyMedia"
import toast from "react-hot-toast"
import "./styles/profile-styles.scss"

const UserProfilePage = () => {
 
  // Obitene el parametro 'name' de la url de App.jsx
  const {name} = useParams()

  // Obtiene el nombre de usuario actual del almacenamiento local
  const myUser = localStorage.getItem('name') 

  // Estado para manejar si se está editando el perfil
  const [isEditing, setIsEditing] = useState(false)
  const [show, setShow] = useState(0)
  
  // Consulta al servidor y obtener información del usuario
  const { data: user, isLoading: loadingUser , isError: isErrorUser, error: errorUser } = useQuery({
    queryKey: ['user', name], 
    queryFn: () => userProfile(name),
  })  

  const { data, isLoading, isError } = useQuery({
    queryKey: ["publications", name],
    queryFn: () => getUserPublications(name),
  })

  // Si se está cargando la información del usuario, muestra un loader
  if (loadingUser || isLoading ) return <div className="loader-content"> <span className="loader"></span> </div>
  // Si hay un error al obtener la información del usuario, muestra el mensaje de error
  if (isErrorUser || isError) return toast.error(errorUser.message)

  return (
    <div className="profile-section">

      <Helmet>
        <title>TecsupNet | User</title>
      </Helmet>
      {/* Si se está editando el perfil, muestra el componente de edición */}
      {isEditing && (
        <EditProfile user={user} close={() => setIsEditing(false)}/>
      )}
      <div className="profile">
        <div className="profile-banner">
          <img src={user.cover_image} alt="profile-banner"/>
        </div>

        <div className="profile-photo">
          <img src={user.avatar} alt="profile-photo"/>
        </div>

        <div className="profile-info p-card">
          <h4>{user.name} {user.last_name}, <b>{user.code}</b></h4>
          <div className="_interest">
            <span>Departamento Tecnológico:</span>
            <span>{user.degree}</span>
          </div>
          <div className="_interest">
            <IoMdCalendar size={18} />
            Cuenta creada el {' '}
            {new Date(user.date_joined).toDateString().slice(4)}
          </div>

          {/* Botón de edición, visible solo si el perfil es del usuario actual */}
          {myUser === name ? (
            <div className="edit-button">
              <button onClick={() => setIsEditing(true)}>Editar</button>
            </div>
          ):(
            null
          )}
          <div className="_interactions">
            <button onClick={() => setShow(0)} className={show === 0 ? "active" : ""}>
              TecsuPosts
            </button>
            <button onClick={() => setShow(1)} className={show === 1 ? "active" : ""}>
              Media
            </button>
            <button onClick={() => setShow(2)} className={show === 2 ? "active" : ""}>
              Me gusta
            </button>
          </div>

          {show === 0 && <MyPosts user={user} publications={data} myUser={myUser} />}
          {show === 1 && <MyMedia publications={data} />}
          {show === 2 && <MyLikes user={user} />}

        </div>

      </div>
    </div>
  )
}

export default UserProfilePage