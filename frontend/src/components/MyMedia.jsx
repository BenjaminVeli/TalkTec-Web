import PropTypes from "prop-types"

const MyMedia = ({ publications }) => {
  return (
    <>
      {publications.map(t => (
        <div key={t.id}>
          <img src={t.image} className="post-img" />
        </div>
      ))}
    </>
  )
}

MyMedia.propTypes = {
  publications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default MyMedia