import { tcWeek } from "../ImportImages"

const RightSidebar = () => {
  return (
    <div className="right-sidebar">

        <div className="sidebar-title">
            <h4>Eventos</h4>
            <a href="#">See All</a>
        </div>

      <div className="event">
        <div className="left-event">
            <h3>23</h3>
            <span>Octubre</span>
        </div>

        <div className="right-event">
            <h4>INICIO DE SEMANA</h4>
            <p>CULTURAL T&C WEEK</p>
        </div>
      </div>

      <div className="event">
        <div className="left-event">
            <h3>28</h3>
            <span>Octubre</span>
        </div>

        <div className="right-event">
            <h4>FIN DE SEMANA</h4>
            <p>CULTURAL T&C WEEK</p>
        </div>
      </div>

      <div className="sidebar-title">
            <h4>Anuncio</h4>
      </div>

      <img src={tcWeek} className="sidebar-adss" />

    </div>
  )
}

export default RightSidebar