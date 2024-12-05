import { useState } from "react"; // Importa useState para manejar el estado
import { logoutAdmin } from "../api/users";
import { Link } from "react-router-dom";
import { AlignJustify, LogOut } from 'lucide-react';

const HeaderAdmin = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el menú está abierto

  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setIsOpen(!isOpen); // Cambia el estado de abierto a cerrado o viceversa
  };

  return (
    <>
      <header>
        <div className="navbar">
          <div className="logo-panel"><Link>Admin Panel</Link></div>
          <ul className="links">
            <li><Link to="/admin-users">Users List</Link></li>
            <li><Link to="/admin-publications">Publications List</Link></li>
            <li><Link to="/admin-reports">Reports</Link></li>
          </ul>
          <span className="action_btn" onClick={ logoutAdmin }>
            <LogOut size={16} className="icon-lucide"/>Cerrar sesión
          </span>
          
          {/* Botón para abrir/cerrar el menú */}
          <div className="toggle_btn" onClick={toggleMenu}>
            <AlignJustify size={30} className=""/>
          </div>

          {/* Menú desplegable con clase dinámica según el estado */}
          <div className={`dropdown_menu ${isOpen ? 'open' : ''}`}>
            <li><Link to="/admin-users">Users List</Link></li>
            <li><Link to="/admin-publications">Publications List</Link></li>
            <li><Link to="/admin-reports">Reports</Link></li>
            <li>
              <span className="action_btn" onClick={ logoutAdmin }><LogOut size={16} className="icon-lucide"/>Cerrar sesión</span>
            </li>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderAdmin;
