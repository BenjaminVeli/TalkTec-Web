import { editComment } from "../api/publication"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { useState } from "react"
import "./styles/editcomment-styles.scss"
import toast from "react-hot-toast"
import PropTypes from "prop-types"


const EditComment = ({ c, close }) => {

  const queryClient = useQueryClient()

  const [body, setBody] = useState(c.body)

  const editCommentMutation = useMutation({
    mutationFn: editComment,
    onSuccess: () => {
      queryClient.invalidateQueries("comments")
      toast.success("Comentario editado")
      close()
    },
    onError: (error) => {
      toast.error(error.message)
      close()
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    editCommentMutation.mutate({ id: c.id, body: body, publication: c.publication })
  }

  const handleChange = (e) => {
    setBody(e.target.value)
  }

  console.log(c)

  return (
    <div className="modal-overlay-comment">
      <div className="modal-content-comment">
        <div className="modal-header-comment">
          <h2>Editar Comentario</h2>
          <button onClick={close} className="close-button">
            <AiOutlineCloseCircle className="close-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-comment">

          
            <label >
              Editar comentario:
            </label>
            
            <input
              id="body"
              type="text"
              name="body"
              onChange={handleChange}
              value={body}
              placeholder="Editar comentario"
            />
          

          <button type="submit" className="submit-button">
            Guardar Cambios
          </button>
        </form>

        <div className="modal-footer">
          <div className="spacer"></div>
        </div>
      </div>
    </div>
  )
}

EditComment.propTypes = {
  c: PropTypes.shape({
    id: PropTypes.number.isRequired,
    body: PropTypes.string.isRequired,
    publication: PropTypes.number.isRequired,
  }).isRequired,
  close: PropTypes.func.isRequired,
}

export default EditComment