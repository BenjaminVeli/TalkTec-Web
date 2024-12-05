import { useQuery } from "@tanstack/react-query"
import { getUserLikes } from "../api/publication"
import { AiOutlineComment } from "react-icons/ai"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import Like from "./Like"
import PropTypes from "prop-types"
import { baseURL } from "../api/useAxios";

const MyLikes = ({ user }) => {

  const userId = localStorage.getItem('user_id')

  const { data: likes, isLoading, isError, error } = useQuery({
    queryKey: ['publications'], 
    queryFn: () => getUserLikes(user.name),
  })

  if (isLoading) return <div className="loader-content"> <span className="loader"></span> </div>
  if (isError) return toast.error(error.message)

  return (
    <>
      {likes.map && likes.map(t => (
        <div key={t.id} className="container-post">
          <div className="post-row">
            <div className="user-profile-post">
            <img src={`${baseURL}${t.avatar}`} alt="profile-photo"/>
              <div>
                <Link to={`/${t.user}`}>
                  <p>{t.user} {t.userlastname}</p>
                </Link>
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

              </div> 
          </div>
        </div>
      ))}
    </>
  )
}

MyLikes.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
}

export default MyLikes