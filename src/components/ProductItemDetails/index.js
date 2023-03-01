// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productItemDetails: {},
    similarProductsList: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = response.json()
    if (response.ok === true) {
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      const fetchedData = data.similar_products.map(eachData => ({
        id: eachData.id,
        imageUrl: eachData.image_url,
        title: eachData.title,
        style: eachData.style,
        price: eachData.price,
        description: eachData.description,
        brand: eachData.brand,
        totalReviews: eachData.total_reviews,
        rating: eachData.rating,
        availability: eachData.availability,
      }))
      this.setState({
        productItemDetails: updatedData,
        similarProductsList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  quantityDecrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity - 1}))
  }

  quantityIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductItemDetails = () => {
    const {productItemDetails, quantity, similarProductsList} = this.state
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      availability,
      rating,
      price,
      description,
    } = productItemDetails
    return (
      <>
        <div className="prd-item-cont">
          <img src={imageUrl} alt="product" />
          <div>
            <h1>{title}</h1>
            <p>{`Rs ${price}/-`}</p>
            <div className="prd-item-cont">
              <div>
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>
              Available: <span>{availability}</span>
            </p>
            <p>
              Brand: <span>{brand}</span>
            </p>
            <hr />
            <div className="prd-item-cont">
              <button
                className="btn"
                onClick={this.quantityDecrement}
                type="button"
              >
                <BsDashSquare />
              </button>
              <p>{quantity}</p>
              <button
                className="btn"
                onClick={this.quantityIncrement}
                type="button"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">ADD TO CART</button>
          </div>
        </div>
        <ul className="similar-cont">
          <h1>Similar Products</h1>
          {similarProductsList.map(eachProduct => (
            <SimilarProductItem
              productDetails={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </>
    )
  }

  renderFailureView = () => (
    <div className="fail-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1>Product Not Found</h1>
      <Link className="link2" to="/products">
        <button className="btn" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderProductDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails
