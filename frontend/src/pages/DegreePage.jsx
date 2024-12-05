import { useParams, Link } from 'react-router-dom'
import { getPublicationsByDegree } from "../api/publication" 
import { AiOutlineComment } from "react-icons/ai"
import { useQuery } from "@tanstack/react-query"
import Like from "../components/Like"
import LeftSidebar from "../components/LeftSidebar"
import RightSidebar from "../components/RightSidebar"
import toast from "react-hot-toast"

const DegreePage = () => {

  const { degreeId } = useParams()

  const { data: publications, isLoading, isError, error } = useQuery({
    queryKey: ['PublicationsByDegree', degreeId], 
    queryFn: () => getPublicationsByDegree(degreeId),
  })

  if (isLoading) return <div className="loader-content"> <span className="loader"></span> </div>
  if (isError) return toast.error(error.message)

  console.log(publications)

  return (
    <div className="container-home">
      <LeftSidebar />
      <div className="main-content">
        {publications.map((t) => (
          <>
            <div key={t.id} className="post-container-home">
              <div className="post-row">
                <div className="user-profile-home">
                  <img src={`http://127.0.0.1:8000/${t.avatar}`} alt="profile-photo"/>
                  <div>
                    <Link to={`/${t.user}`}>
                      {t.user} {t.userlastname}
                    </Link>
                    <br />
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

              <Link to={`/publication/${t.id}`}>
                <p className="post-text">
                  {t.content}
                </p>

                <img src={t.image} className="post-img" />
              </Link>
              
              <div className="post-row-activity">
                <div className="activity-icons">

                  <div className="icon-like">
                    <Like t={t}/>
                  </div>

                  <Link className="comment" to={`/publication/${t.id}`}>
                    <AiOutlineComment className="icon-coment" size={24} />
                    <p>{t.parent.length}</p>
                  </Link>

                </div> 
              </div>

            </div>
          </>
        ))}
      </div>
      <RightSidebar />
    </div>
  )
}

export default DegreePage