import { baseURL } from "../../../api/useAxios";
import { X } from "lucide-react";

const ViewModal = ({ 
  comments, 
  commentsTotalPages, 
  commentsCurrentPage, 
  paginateComments, 
  closePublicationViewModal 
}) => {
  return (
    <div className="modal">
      <div className="modal-content-1">
        <button className="modal-close" onClick={closePublicationViewModal}>
          {<X size={20} />}
        </button>
        <div className="container--field-publication">
          <h2 className="container--fields-h2">
            Comentarios de la Publicación
          </h2>
          <div className="information-fields">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="post-container-home">
                  <div className="user-profile-home">
                    <img
                      src={`${baseURL}${comment.avatar}`}
                      alt="profile-photo"
                    />
                    <div className="user-information">
                      <a>
                        {comment.user.name} {comment.user.last_name}
                      </a>
                      <br />
                      <span>
                        {new Date(comment.created_at).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="post-text">{comment.body}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay comentarios.</p>
            )}
          </div>

          {/* Pagination */}
          {commentsTotalPages > 1 && (
            <div className="pagination-crud">
              <ul className="pagination-crud-ul">
                {Array.from({ length: commentsTotalPages }, (_, index) => (
                  <li key={index + 1}>
                    <span
                      onClick={() => paginateComments(index + 1)}
                      className={`pagination-crud-span ${
                        commentsCurrentPage === index + 1 ? "active" : ""
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
      </div>
    </div>
  );
};

export default ViewModal;