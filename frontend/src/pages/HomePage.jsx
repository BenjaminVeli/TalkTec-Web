import LeftSidebar from "../components/LeftSidebar"
import RightSidebar from "../components/RightSidebar"
import { Helmet } from "react-helmet"
import { getPublications } from "../api/publication"
import { AiOutlineComment } from "react-icons/ai"
import { Link } from "react-router-dom"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import Like from "../components/Like"
import AddPublication from "../components/AddPublication"
import toast from "react-hot-toast"

const HomePage = () => {

  const { ref, inView } = useInView()

  const { data, isLoading, isError, error, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['publications'],
    queryFn: getPublications,
    getNextPageParam: (lastPage) => lastPage.meta.next
  })

  useEffect(() => {
    if (inView){
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  if (isLoading ) return <div className="loader-content"> <span className="loader"></span> </div>
    
  if (isError ) return toast.error(error.message)

  return (

    <div className="container-home">

    <Helmet>
      <title>TecsupNet | Home</title>
    </Helmet>
    
    <LeftSidebar publications={data?.pages}/>

    <div className="main-content">

      <AddPublication />

      {data?.pages.map(page => (
        <div key={page.meta.page}>

          {page.data.map(t => (

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
                
              {!isLoading && data.pages.length === 0 && <p>No results</p>}
              {!isLoading && data.pages.length  > 0 && hasNextPage && (
                <div ref={ref} >
                  {isLoading || isFetchingNextPage ? <div className="loader-content"> <span className="loader"></span> </div> : null}
                </div>
              )}

            </>
          ))}
        </div>

      ))}

    </div>

    <RightSidebar />

    </div>
  )
}

export default HomePage