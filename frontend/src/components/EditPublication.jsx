import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { editPublication } from "../api/publication"
import { AiOutlineCloseCircle } from "react-icons/ai"
import toast from "react-hot-toast"
import PropTypes from 'prop-types'
import "./styles/editpublication-styles.scss"

const EditPublication = ({ publication, close }) => {

  const queryClient = useQueryClient()
  const [content, setContent] = useState(publication.content)
  const [image, setImage] = useState(null)

  const handleImageChange = (event) => {
    setImage(event.currentTarget.files[0])
  }

  const editPublicationMutation = useMutation({
    mutationFn: editPublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] })
      toast.success("Publicación actualizada")
      close()
    },
    onError: (error) => {
      console.error("Error al editar la publicación:", error)
      toast.error("Hubo un error al editar la publicación")
      close()
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("content", content)
    formData.append("id", publication.id)
    if (image) {
      formData.append("image", image)
    }
    editPublicationMutation.mutate(formData)
  }


  return (
    <div className="modal-overlay-publication">
      <div className="modal-content-publication">
        <div className="modal-header-publication">
          <h2>Edit Profile</h2>
          <button onClick={close} className="close-button">
            <AiOutlineCloseCircle className="close-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          <div>
            <label >
              Editar Contenido de la Publicación
            </label>
            
            <input
              id="content"
              type="text"
              name="content"
              size={36}
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Content"
            />
          </div>

          <div>
            <label>
              Editar Imagen para la publicación
            </label>
            
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <button type="submit" className="submit-button">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  )
}

EditPublication.propTypes = {
  publication: PropTypes.shape({
    content: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  close: PropTypes.func.isRequired,
}

export default EditPublication