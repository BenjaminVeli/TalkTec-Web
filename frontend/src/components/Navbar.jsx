import { logo, logoutimage, searchImage } from "../ImportImages"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { logout, userProfile, q } from "../api/users"
import { useQuery } from "@tanstack/react-query"
import "./styles/navbar-styles.css"
import PropTypes from 'prop-types'
import toast from "react-hot-toast"
import { baseURL } from "../api/useAxios";

function Result({ data, isLoading, isError, error }) {

  const clearSearch = () => {
    setSearch('')
  }

  if (isLoading) { return <div className="loader-content"> <span className="loader"></span> </div> }
  if (isError) { return toast.error(error.message)}

  return(
    <>
      <div className="search-results">
        {data && data.map((user) => (
          <Link className="search-result" to={`/${user.name}`} key={user.name} onClick={clearSearch}>
            <div className="search-result">
                <img src={`${baseURL}${user.avatar}`} alt="Avatar" />
                <div className="user-info">
                  <p>{`${user.name} ${user.last_name}`}</p>
                  <p>{user.degree}</p>
                </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

const Navbar = () => {
  
  const [theme, setTheme] = useState('light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [search, setSearch] = useState("")
  const user = localStorage.getItem('name') 

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["search", search],
    queryFn: () => {
      if(search) {
        return q(search)
      }
      return {users: []}
    }
  })

  const handleProfileClick = () => {
    setMenuOpen(false) // Cierra el menú desplegable cuando se hace clic en "Ver mi perfil"
  }

  useEffect(() => {
    const localTheme = localStorage.getItem('theme')
    if (localTheme) {
      setTheme(localTheme)
    }
    // Obtener detalles del usuario al cargar el componente
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    try {
      const user = await userProfile(localStorage.getItem('name'))
      setUserInfo(user)
    } catch (error) {
      console.error('Error al obtener detalles del usuario', error)
    }
  }

  const toggleTheme = () => {
    const updatedTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(updatedTheme)
    localStorage.setItem('theme', updatedTheme)
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark')
  }, [theme])
  
  return (
    // console.log(userInfo),
    <>
      <nav>
        <Link className="nav-left" to='/home'>
          <img src={logo} alt="Logo-TalkTec" className="logo" />  
          <h2>Tecsup</h2>
        </Link>

        <div className="search-box">
            <img src={searchImage}  />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Buscar Usuario" />
        </div>

        {data?.users.length > 0 && <Result data={data.users} isLoading={isLoading} isError={isError} error={error}/>}

        {/* aqui es el profile */}
      
        <div className="nav-right">

          <div className={`nav-user-icon online ${menuOpen ? 'settings-menu-height' : ''}`} onClick={toggleMenu}> {/* modificar onclick = onclick="settingsMenuToggle()" */}
            <img src={userInfo ? userInfo.avatar : ''} alt="Avatar" />
          </div>
            
          {/* settings menu */}

          <div className={`settings-menu ${menuOpen   ? 'settings-menu-height' : ''}`}>

            <div id="dark-btn" className={`dark-btn ${theme === 'dark' ? 'dark-btn-on' : ''}`} onClick={toggleTheme}>
              <span></span>
            </div>

            <div className="settings-menu-inner">

              <div className="user-profile">
                <img src={userInfo ? userInfo.avatar : ''} alt="Avatar" />
                  <div>
                    <p>{userInfo ? `${userInfo.name} ${userInfo.last_name}` : 'Cargando...'}</p>
                    <span><Link to={user} onClick={handleProfileClick}>Ver mi perfil</Link></span>
                  </div>
              </div>

              <hr />

              <div className="settings-links">
                <img src={logoutimage} className="settings-icon" />
                <span onClick={ logout }>Logout</span>
              </div>

            </div>
              
          </div>
        
        </div>
    
      </nav>
    </>
  )
}

Result.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

export default Navbar