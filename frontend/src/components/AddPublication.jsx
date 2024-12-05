import { addPublication } from "../api/publication"
import { userProfile } from "../api/users"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { BsImage } from "react-icons/bs"
import { AiFillCloseCircle } from "react-icons/ai"
import { useState, useEffect } from "react"
import PropTypes from 'prop-types'

const AddPublication = () => {

  const queryClient = useQueryClient()

  // Estados locales para manejar la información del usuario, el contenido de la publicación y la imagen
  const [userInfo, setUserInfo] = useState(null)
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)

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

  // Hook useMutation
  const addPublicationMutation = useMutation({
    mutationFn: addPublication,
    onSuccess: () => {
      // Invalida la consulta
      queryClient.invalidateQueries('publications')
      toast.success('Se ha publicado con exito!')
    },
    onError: () =>{
      toast.error('Hubo un error a la hora de publicar!')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('content', content)

    if (image) {
      formData.append('image', image)
    }

    formData.append('user', localStorage.getItem('user_id'))
    addPublicationMutation.mutate(formData)
    setContent('')
    setImage(null)
  }

  const handleImageChange = (event) => {
    setImage(event.currentTarget.files[0])
  }

  if (addPublicationMutation.isLoading ) return <div className="loader-content"> <span className="loader"></span> </div>

  return (
    <div className="write-post-container">
      <form onSubmit={handleSubmit}>

        <div className="user-profile-home">
          <img src={userInfo ? userInfo.avatar : ''} alt={userInfo ? `${userInfo.name} ${userInfo.last_name}` : 'Cargando...'}/>
          <div>
            <p>{userInfo ? `${userInfo.name} ${userInfo.last_name}` : 'Cargando...'}</p>
            <small>Publica Algo!</small>
          </div>
        </div>

        <div className="post-input-container">
          <textarea 
            name="content" 
            onChange={(e) => setContent(e.target.value)}
            value={content}
            placeholder="¿Quieres publicar algo?" 
            rows="3" />

          <div className="add-post-links">
            <label htmlFor="file-input">
              {!image && (
                <BsImage
                  size={20}
                />
              )}
            </label>

            <input
              className="hidden"
              type="file"
              name="image"
              onChange={handleImageChange}
              id="file-input"
            />

            <div>
              {image && <SeeImage file={image} />}
            </div>

            <div>
              <button
                className="public-button"
                type='submit'
              >
                Publicar
              </button>
            </div>
          </div>
        </div>

      </form>
  </div>
  )
}

const SeeImage = ({ file }) => {
  const [preview, setPreview] = useState('')

  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setPreview(reader.result)
    }

    const handleClose = () => {
      setPreview('')
    }

    return (
      <div className="image-preview">
        <div>
          <button
            onClick={handleClose}
          >
            <AiFillCloseCircle size={30} />
          </button>
        </div>
        <img src={preview} width={350} height={350} alt="Preview" />
      </div>
    )
  }
}

SeeImage.propTypes = {
  file: PropTypes.instanceOf(File),
}

export default AddPublication