import { shortcutOne, shortcutTwo, shortcutThree, shortcutFour, shortcutFive, shortcutSix, shortcutSeven, shortcutEight } from "../ImportImages"
import { Link } from "react-router-dom"

const LeftSidebar = () => {

  return (

    // {/* left-Sidebar, modifica el link con relación al App.jsx */}
    <div className="left-sidebar">
      <div className="shortcut-links">
          <p>Carreras</p>
          <Link to="/degree/1"><img src={shortcutOne} />Tecnología Digital</Link>
          <Link to="/degree/2"><img src={shortcutTwo} />Mecánica y Aviación</Link>
          <Link to="/degree/3"><img src={shortcutThree} />Minería, Procesos Químicos y Metalúrgicos</Link>
          <Link to="/degree/4"><img src={shortcutFour} />Mecatrónica</Link>
          <Link to="/degree/5"><img src={shortcutFive} />Electricidad y Electrónica</Link>
          <Link to="/degree/6"><img src={shortcutSix} />Gestión y Producción</Link>
          <Link to="/degree/7"><img src={shortcutSeven} />Seguridad y Salud en el Trabajo</Link>
          <Link to="/degree/8"><img src={shortcutEight} />Tecnología Agrícola</Link>
      </div>
    </div>
  )
}

export default LeftSidebar