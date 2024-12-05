import { X } from 'lucide-react';

const ViewModal = ({ user, closeUserViewModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closeUserViewModal}>
        {<X size={20}/>}
        </button>
        <div className="container--field">
          <h2 className="container--fields-h2">Detalles del usuario</h2>
          <div className="information-fields">
          <span className="detail-span">Código:<p className="detail-p">{user.code}</p></span>
          <span className="detail-span">Email:<p className="detail-p">{user.email}</p></span>
          <span className="detail-span">Nombres:<p className="detail-p">{user.name}</p></span>
          <span className="detail-span">Apellidos:<p className="detail-p">{user.last_name}</p></span>
          <span className="detail-span">Departamento:<p className="detail-p">{user.degree.name_depart}</p></span>
          <span className="detail-span">Creación de cuenta:<p className="detail-p">{user.date_joined}</p></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewModal