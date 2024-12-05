import { AiOutlineComment } from "react-icons/ai"
import { getSoloPublication } from "../api/publication"
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import LeftSidebar from "../components/LeftSidebar"
import RightSidebar from "../components/RightSidebar"
import Like from "../components/Like"
import Comments from "../components/Comments"
import "./styles/soloPost-styles.css"

const SoloPostPage = () => {

  const {id} = useParams()

  const { data: publication, isLoading, isError, error } = useQuery({
    queryKey: ['soloPublication', id], 
    queryFn: () => getSoloPublication(id),
  })

  if(isLoading) return <div className="loader-content"> <span className="loader"></span> </div>
  if(isError) return toast.error(error.message) 

  return (
    <div className="container-home">
      <LeftSidebar />

      <div className="main-content">

        <div className="post-container">
          <div className="post-row">
            <div className="user-profile-home">
              <img src={`http://127.0.0.1:8000/${publication.avatar}`} alt="profile-photo"/>
              <div>
                <Link to={`/${publication.user}`}>
                  {publication.user} {publication.userlastname}
                </Link>
                <br />
                {/* <p>Diego Ferrer</p> */}
                <span>
                  {new Date(publication.created_at).toLocaleString('es-ES', {
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
              {publication.content}
            </p>

            <img src={publication.image} className="post-img" />
          </div>

          <div className="post-row-activity">
            <div className="activity-icons">

            <div>
              <Like t={publication}/>
            </div>

            <div className="comment">
              <AiOutlineComment className="icon-coment" size={24} />
              <p>{publication.parent.length}</p>
            </div>

            </div> 
          </div>
        </div>

        <Comments publication={publication}/>
      </div>


      <RightSidebar />
    </div>
  )
}

export default SoloPostPage