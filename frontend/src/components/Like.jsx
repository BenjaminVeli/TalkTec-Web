import { BiLike } from "react-icons/bi"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { like } from "../api/publication"
import PropTypes from "prop-types"

const Like = ({ t }) => {

  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: like,
    onSuccess: () => {
      queryClient.invalidateQueries('publications')
    },
    onError: (error) => {
      console.log(error)
    }
  })

  return (
    <>
      <BiLike onClick={() => likeMutation.mutate(t.id)} { ...t.iliked ? {color: 'blue'} : {color: ''} } className="icon-like" size={23}/>
      <p>{t.likes_count}</p>
    </>
  )
}

Like.propTypes = {
  t: PropTypes.shape({
    id: PropTypes.number.isRequired,
    iliked: PropTypes.bool.isRequired,
    likes_count: PropTypes.number.isRequired,
  }).isRequired,
}

export default Like