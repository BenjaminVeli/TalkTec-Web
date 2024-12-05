import { getUserPublications, deletePublication } from "../api/publication"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AiOutlineComment } from "react-icons/ai"
import { BiEditAlt } from "react-icons/bi"
import { MdDeleteOutline } from "react-icons/md"
import { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import EditPublication from "./EditPublication"
import PropTypes from 'prop-types'
import Like from "./Like"
import "./styles/myposts-styles.scss"
import { baseURL } from "../api/useAxios";

const MyPosts = ({ user, myUser }) => {

  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const userId = localStorage.getItem('user_id')

  // console.log(publications)

  const deletePublicationMutation = useMutation({
    mutationFn: deletePublication,
    onSuccess: () => {
      queryClient.invalidateQueries(['publications', user.name])
      toast.success("Publicación eliminada correctamente!")      
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["publications", user.name],
    queryFn: () => getUserPublications(user.name),
  })

  // console.log(data, user)

  if (deletePublicationMutation.isLoading) return <div className="loader-content"> <span className="loader"></span> </div>
  if (isLoading) return <div className="loader-content"> <span className="loader"></span> </div>
  if (isError) return toast.error(error.message)

  return (
    <>
      {data.map && data.map(t => (
        // console.log(myUser === user.name),
        <div key={t.id} className="container-post">
          <div className="post-row">
            <div className="user-profile-post">
                <img src={`${baseURL}${t.avatar}`} alt="profile-photo"/>
              <div>
                <p>{t.user} {t.userlastname}</p>
                <span>
                  {new Date(t.created_at).toLocaleString('es-ES', {
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
              {t.content}
            </p>
          </div>
          
          <img src={t.image} className="post-img" />

          <div className="post-row">
              <div className="activity-icons">
                <div className="icon-like">
                  <Like t={t} user={userId}/>
                </div>
                <Link className="comment" to={`/publication/${t.id}`}>
                  <AiOutlineComment className="icon-coment" size={24} />
                  <p>{t.parent.length}</p>
                </Link>

                {myUser === user.name && (
                  <>
                    <div
                      className="icon-delete">
                      <MdDeleteOutline 
                        onClick={() => deletePublicationMutation.mutate(t.id)}
                        size={24}/>
                    </div>

                    <div
                      className="icon-edit">
                      <BiEditAlt  onClick={() => setIsEditing(t.id)} size={24}/>
                    </div>

                {isEditing === t.id && (
                  <EditPublication publication={t} close={() => setIsEditing(null)}/>
                )}
                  </>
                )}

              </div> 
          </div>
        </div>
      ))}
    </>
  )
}

MyPosts.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  myUser: PropTypes.string.isRequired,
}

export default MyPosts