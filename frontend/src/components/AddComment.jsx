import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment } from "../api/publication"
import { userProfile } from "../api/users"
import toast from "react-hot-toast"
import PropTypes from "prop-types"
import "./styles/addcomment-styles.scss"


const AddComment = ({ publication }) => {

  const queryClient = useQueryClient()
  const [userInfo, setUserInfo] = useState(null)

  // Cuando se carga el componente:
  useEffect(() => {
    // Obtener detalles del usuario al cargar el componente
    getUserInfo()
  }, [])

  // Función asincrónica para obtener detalles del usuario
  const getUserInfo = async () => {
    try {
      const user = await userProfile(localStorage.getItem('name'))
      setUserInfo(user)
    } catch (error) {
      console.error('Error al obtener detalles del usuario', error)
    }
  }

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries('comments')
      toast.success('Se podido comentar con exito!')
    },
    onError: (error) =>{
      toast.error(error.message)
    }
  })

  const [formData, setFormData] = useState({ body: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addCommentMutation.mutate({ ...formData, id: publication.id })
    setFormData({ body: '' })
  }


  if (addCommentMutation.isLoading ) return <div className="loader-content"> <span className="loader"></span> </div>

  return (
    <div className="content-comment">
      <form onSubmit={handleSubmit}>
        <div className="row-comment">

          <div className="user-row-comment">
            <div className="user-profile-comment">
              <img src={userInfo ? userInfo.avatar : ''} alt={userInfo ? `${userInfo.name} ${userInfo.last_name}` : 'Cargando...'}/>
              <div>
              <p>{userInfo ? `${userInfo.name} ${userInfo.last_name}` : 'Cargando...'}</p>
              </div>
            </div>
          </div>

          <textarea 
            name="body" 
            onChange={handleChange}
            value={formData.body}
            placeholder="Comenta aqui!" 
            rows="2" />

        </div>
        <div className="button-row-comment">
          <button
            type="submit"
            className="comment-button"
          >
            Comentar
          </button>
        </div>
      </form>
    </div>
  )
}

AddComment.propTypes = {
  publication: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
}

export default AddComment