import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { getComments, deleteComment } from "../api/publication"
import { BiEditAlt } from "react-icons/bi"
import { MdDeleteOutline } from "react-icons/md"
import { Link } from "react-router-dom"
import { useState } from "react"
import PropTypes from "prop-types"
import toast from "react-hot-toast"
import AddComment from "./AddComment"
import EditComment from "./EditComment"
import { baseURL } from "../api/useAxios";

const Comments = ({ publication }) => {

  const [show, setShow] = useState(false)

  // Obtiene el nombre de usuario actual del almacenamiento local
  const myUser = localStorage.getItem('name') 
  
  const queryClient = useQueryClient()

  const { data: comments, isLoading, isError, error } = useQuery({
    queryKey: ["comments", publication.id],
    queryFn: () => getComments(publication.id)
  })

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries("comments")
      toast.success("Comentario Eliminado")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  if(isLoading) return <div className="loader-content"> <span className="loader"></span> </div>
  if(isError) return toast.error(error.message) 

  return (
    <div>
      <AddComment publication={publication}/>
      {comments.map(c => (      

        <div key={c.id} className="post-container-home">

          <div className="post-row">
            <div className="user-profile-home">
              <img src={`${baseURL}${c.avatar}`} alt="profile-photo"/>
              <div>
                <Link to={`/${c.user}`}>
                  {c.user} {c.userlastname}
                </Link>
                <br />
                {/* <p>Diego Ferrer</p> */}
                <span>
                  {new Date(c.created_at).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </span>

              </div>
            </div>
          </div>
            
          <div>
            <p className="post-text">
              {c.body}
            </p>
          </div>

          {myUser === c.user ? (
            <div className="post-row">
              <div className="activity-icons">

                <div
                  className="icon-delete">
                  <MdDeleteOutline onClick={() => deleteCommentMutation.mutate(c.id)} size={24}/>
                </div>

                <div>
                  <BiEditAlt className="icon-edit" onClick={() => setShow(true)} size={24}/>
                  {show && <EditComment c={c} close={() => setShow(false)} />}
                </div>

              </div> 
            </div>
          ):(
            null
          )}

        </div>
      
      ))}
    </div>
  )
}

Comments.propTypes = {
  publication: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
}

export default Comments