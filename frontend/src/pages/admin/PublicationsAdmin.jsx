import { useState, useEffect, useCallback } from "react";
import {
  deletePublicationList,
  getPublicationsList,
  getCommentsList,
} from "../../api/publication";
import HeaderAdmin from "../../components/HeaderAdmin";
import { Helmet } from "react-helmet";
import { Search } from "lucide-react";
import "../styles/crud-styles.css";

import { BiTrash, BiLike } from "react-icons/bi";
import { AiOutlineComment } from "react-icons/ai";
import DeleteModal from "../../components/admin/Publications/DeleteModal";
import ViewModal from "../../components/admin/Publications/ViewModal";
import { baseURL } from "../../api/useAxios";

const PublicationsAdmin = () => {
  const [publications, setPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(2); // Ajusta según tu backend
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [comments, setComments] = useState([]);
  const [commentsCurrentPage, setCommentsCurrentPage] = useState(1);
  const [commentsRecordsPerPage] = useState(2);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);


  const [selectedPublication, setSelectedPublication] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchPublications = useCallback(
    async (page = 1) => {
      try {
        const res = await getPublicationsList({
          page,
          page_size: recordsPerPage,
          search: searchQuery,
        });
        setPublications(res.results);
        setTotalPages(Math.ceil(res.count / recordsPerPage));
      } catch (error) {
        console.error("Error al obtener la lista de publicaciones:", error);
      }
    },
    [recordsPerPage, searchQuery]
  );

  const deletePublication = async (publicationId) => {
    try {
      await deletePublicationList(publicationId);
      setPublications((prevPublications) =>
        prevPublications.filter(
          (publication) => publication.id !== publicationId
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    }
  };

  useEffect(() => {
    fetchPublications(currentPage);
  }, [currentPage, fetchPublications]);

  const onSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Resetea a la primera página al buscar
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const openModal = (publication, type) => {
    setSelectedPublication(publication);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedPublication(null);
    setModalType(null);
  };

  // Comments
  const fetchComments = useCallback(async (publicationId) => {
    console.log("Fetching comments para la página:", commentsCurrentPage);
    try {
      const res = await getCommentsList(
        publicationId,
        commentsCurrentPage, // Usa el valor actualizado aquí
        commentsRecordsPerPage
      );
      setComments(res.results);
      setCommentsTotalPages(Math.ceil(res.count / commentsRecordsPerPage));
    } catch (error) {
      console.error("Error al obtener los comentarios:", error);
    }
  }, [commentsCurrentPage, commentsRecordsPerPage]);


  useEffect(() => {
    if (selectedPublication) {
      fetchComments(selectedPublication.id); // Asegúrate de que se llame con el ID correcto
    }
  }, [commentsCurrentPage, selectedPublication, fetchComments]);

  const paginateComments = (pageNumber) => {
    console.log("Cambiando página de comentarios a:", pageNumber);
    setCommentsCurrentPage(pageNumber);
  };

  return (
    <div>
      <Helmet>
        <title>TecsupNet | Admin Panel - Publications</title>
      </Helmet>
      <HeaderAdmin />

      <div className="container-crud-post">
        <h2 className="table-heading">Lista de Publicaciones</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar publicaciones"
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
              <th>Publicaciones</th>
            </tr>
          </thead>
          <tbody>
            {publications.length > 0 ? (
              publications.map((publication) => (
                <tr key={publication.id}>
                  <td>{publication.id}</td>
                  <td className="td-container-post">
                    <div className="post-container-home">
                      <div className="post-row">
                        <div className="user-profile-home">
                          <img
                            src={`${baseURL}${publication.avatar}`}
                            alt="profile-photo"
                          />
                          <div className="user-information">
                            <a>
                              {publication.user.name}{" "}
                              {publication.user.last_name}
                            </a>
                            <br />
                            <span>
                              {new Date(publication.created_at).toLocaleString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="post-text">{publication.content}</p>
                      </div>

                      <img
                        src={`${baseURL}${publication.image}`}
                        className="post-img-admin"
                        alt=""
                      />

                      <div className="post-row-activity">
                        <div className="activity-icons">
                          <div className="icon-like">
                            <BiLike color="blue" size={24} />
                            <p>{publication.likes_count}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            fetchComments(publication.id);
                            openModal(publication, "view");
                          }}
                          className="btn-activity"
                        >
                          <AiOutlineComment className="icon-coment" size={24} />
                        </button>

                        <button
                          onClick={() => openModal(publication, "delete")}
                          className="btn-activity"
                        >
                          <BiTrash color="red" size={24} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay publicaciones registradas.</td>
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

      {modalType === "view" && selectedPublication && (
        <ViewModal
        publication={selectedPublication}
        comments={comments}
        commentsTotalPages={commentsTotalPages}
        commentsCurrentPage={commentsCurrentPage}
        paginateComments={paginateComments}
        closePublicationViewModal={closeModal}
        />
      )}

      {modalType === "delete" && selectedPublication && (
        <DeleteModal
          publicationId={selectedPublication.id}
          deletePublication={deletePublication}
          closePublicationDeleteModal={closeModal}
        />
      )}
    </div>
  );
};

export default PublicationsAdmin;
