import { useQueryClient, useMutation } from "@tanstack/react-query"
import { updateProfile } from "../api/users"
import toast from "react-hot-toast"
import { AiOutlineCloseCircle } from "react-icons/ai"
import PropTypes from 'prop-types'
import "./styles/editprofile-styles.scss"

const EditProfile = ({ user, close }) => {
    // Instancia de useQueryClient para gestionar las consultas de React Query
    const queryClient = useQueryClient()

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile, // Función de mutación para actualizar el perfil
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', user.name] }) // Invalida la consulta en caché para que se actualice
            toast.success('Perfil actualizado')
            close()
        },
        onError: (error) => {
            toast.error(error.message)
            close()
        }
    })

    // Función para manejar el envío del formulario
    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        updateProfileMutation.mutate(formData) // Inicia la mutación con los datos del formulario
    }

    return (
        <div className="modal-overlay-profile">
            <div className="modal-content-profile">
                <div className="modal-header-profile">
                    <h2>Edit Profile</h2>
                    <button onClick={close} className="close-button">
                    <AiOutlineCloseCircle className="close-icon" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                <label className="file-input-label">
                    <img src={user.avatar} alt="image-upload" />
                    Cargar Imagen de Perfil de Usuario
                    <input className="file-input" type="file" name="avatar" accept="image/*" />
                </label>

                <label htmlFor="input-profile" className="file-input-label">
                    <img src={user.cover_image} alt="" />
                    Cargar Imagen de Banner de usuario
                    <input id="input-profile" className="file-input" type="file" name="cover_image" accept="image/*" />
                </label>

                <button type="submit" className="submit-button">
                    Save Changes
                </button>
                </form>
            </div>
        </div>
    )
}

EditProfile.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
        cover_image: PropTypes.string.isRequired,
    }).isRequired,
    close: PropTypes.func.isRequired,
}


export default EditProfile