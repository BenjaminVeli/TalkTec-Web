import { useState, useEffect, useCallback } from "react";
import { getUsersList, putUserList } from "../../api/users";
import HeaderAdmin from "../../components/HeaderAdmin";
import { Helmet } from "react-helmet";
import { Search } from "lucide-react";

import ViewModal from "../../components/admin/Users/ViewModal";
import EditModal from "../../components/admin/Users/EditModal";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(6); // Ajusta según tu backend
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchUsers = useCallback(
    async (page = 1) => {
      try {
        const res = await getUsersList({
          page,
          page_size: recordsPerPage,
          search: searchQuery,
        });
        setUsers(res.results);
        setTotalPages(Math.ceil(res.count / recordsPerPage));
      } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
      }
    },
    [recordsPerPage, searchQuery]
  );

  const updateUser = async (updatedUser) => {
    try {
      // Pasa el ID del usuario y los datos actualizados
      await putUserList(updatedUser.id, { is_active: updatedUser.is_active });
      
      // Actualiza el estado de los usuarios
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );
  
      closeModal();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const onSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Resetea a la primera página al buscar
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  return (
    <div>
      <Helmet>
        <title>TecsupNet | Admin Panel - Users</title>
      </Helmet>
      <HeaderAdmin />

      <div className="container-crud">
        <h2 className="table-heading">Lista de Usuarios</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar usuarios"
            value={searchQuery}
            onChange={onSearchInputChange}
          />
          <button className="search-btn" type="submit">
            <Search size={16} />
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Código</th>
              <th>Email</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.code}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.last_name}</td>
                  <td>
                    <button onClick={() => openModal(user, "view")} className="btn btn-primary">View</button>
                    <button onClick={() => openModal(user, "edit")} className="btn btn-warning">Update</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination-crud">
            <ul className="pagination-crud-ul">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1}>
                  <span
                    onClick={() => paginate(index + 1)}
                    className={`pagination-crud-span ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    {index + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {modalType === "view" && selectedUser && (
        <ViewModal
          user={selectedUser}
          closeUserViewModal={closeModal}
        />
      )}

      {modalType === "edit" && selectedUser && (
        <EditModal
          user={selectedUser}
          closeUserEditModal={closeModal}
          onUserUpdated={updateUser}
        />
      )}

    </div>
  );
};

export default UsersAdmin;
