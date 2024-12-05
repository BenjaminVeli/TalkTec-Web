import { useState } from "react";

import { X } from 'lucide-react';

const EditModal = ({ user, closeUserEditModal, onUserUpdated }) => {
  const [isActive, setIsActive] = useState(user.is_active);

  const handleIsAcceptedChange = (e) => {
    setIsActive(e.target.checked);
  };

  const handleConfirmEdit = () => {
    // Llama a la función onUserUpdated con el nuevo estado
    onUserUpdated({ ...user, is_active: isActive });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closeUserEditModal}>
          <X size={20} />
        </button>
        <div className="container--field">
          <h2 className="container--fields-h2">Actualizar usuario</h2>
          <div className="container--form">
            <div className="form--toggle">
              <input className="detail-input" type="checkbox" checked={isActive} onChange={handleIsAcceptedChange}/>
              <span className="detail-span">{isActive ? 'Usuario activo' : 'Usuario desactivado'}</span>
            </div>
            <button onClick={handleConfirmEdit} className="btn btn-danger">Confirmar edición</button>
          </div>
        </div>
      </div>
    </div>
  );
}

  
  export default EditModal