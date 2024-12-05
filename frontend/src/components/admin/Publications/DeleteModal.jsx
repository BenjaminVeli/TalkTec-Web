import { X } from 'lucide-react';

const DeleteModal = ({ closePublicationDeleteModal, deletePublication, publicationId }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closePublicationDeleteModal}>
        {<X size={20}/>}
        </button>
        <div className="container--field">
          <h2 className="container--fields-h2">Eliminar la Publicación</h2>
          <div className="details">
            <div className="detail-block-delete">
              <button onClick={() => deletePublication(publicationId)} className="btn btn-danger">Confirmar eliminación</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal