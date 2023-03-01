// Write your code here

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, price, rating, brand} = productDetails
  return (
    <li className="sim-cont">
      <img
        src={imageUrl}
        alt={`similar product ${title}

`}
      />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <div className="rate-cont">
        <p>{`Rs ${price}/-`}</p>
        <div>
          <p>{rating}</p>
          <img
            alt="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
