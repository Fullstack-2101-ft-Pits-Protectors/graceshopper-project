import React from 'react'
import {connect} from 'react-redux'
import {_checkoutCart, fetchCart, me, _checkoutLocalCart} from '../store'

export class Checkout extends React.Component {
  constructor(props) {
    super(props)
    const {
      name,
      email,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      zipcode,
    } = this.props.user
    this.state = {
      name,
      email,
      phoneNumber,
      ccNumber: '',
      cvv: '',
      billingZipcode: '',
      nameOnCard: '',
      addressLine1,
      addressLine2,
      city,
      state,
      zipcode,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.calculateCartTotal = this.calculateCartTotal.bind(this)
  }
  async componentDidMount() {
    await this.props.loadUserData()
    if (this.props.user.id) {
      this.props.fetchCart(this.props.user.id)
    }
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value,
    })
  }

  calculateCartTotal() {
    let total = 0
    this.props.user.id
      ? (total = this.props.orderInfo.totalValue)
      : this.props.orderItems.map((product) => {
          total += (product.price / 100) * product.quantity
        })
    return total
  }

  handleSubmit(event) {
    event.preventDefault()
    const userInfo = {
      name: this.state.name,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
    }
    const address = {
      addressLine1: this.state.addressLine1,
      addressLine2: this.state.addressLine2,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zipcode,
    }
    const payment = {
      ccNumber: this.state.ccNumber,
      cvv: this.state.cvv,
      zipcode: this.state.billingZipcode,
      nameOnCard: this.state.nameOnCard,
    }
    if (this.props.user.id) {
      const cartId = this.props.orderInfo.id
      this.props.checkoutCart(cartId, userInfo, address, payment)
    } else {
      this.props.loggedOutCheckout(userInfo, address, payment)
    }
  }

  render() {
    const {
      name,
      phoneNumber,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      zipcode,
      ccNumber,
      cvv,
      billingZipcode,
      nameOnCard,
    } = this.state
    return (
      <React.Fragment>
        <div id="order-details">
          <h2>Cart</h2>
          {this.props.orderItems ? (
            this.props.orderItems.map((product) => {
              return (
                <div id="product-details" key={product.id}>
                  <p>Product Name: {product.name}</p>
                  <p>Price: ${product.price / 100}</p>
                  <p>Quantity: {product.quantity}</p>
                  <hr id="break" />
                </div>
              )
            })
          ) : (
            <p>No products in cart!</p>
          )}
          <div id="product-details">
            <h3>Total Cost</h3>
            <p>{this.calculateCartTotal()}</p>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div id="checkout">
            <div id="recipient-info">
              <h3>Recipient Info</h3>
              <label htmlFor="name">
                Name:
                <input
                  name="name"
                  type="text"
                  value={name}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor={email}>
                Email:
                <input
                  name="email"
                  type="text"
                  value={email}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor={phoneNumber}>
                Phone Number:
                <input
                  name="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <div className="address">
              <h3>Address</h3>
              <label htmlFor={addressLine1}>
                Address Line 1:
                <input
                  name="addressLine1"
                  type="text"
                  value={addressLine1}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor={addressLine2}>
                Address Line 2:
                <input
                  name="addressLine2"
                  type="text"
                  value={addressLine2}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor={city}>
                City:
                <input
                  name="city"
                  type="text"
                  value={city}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor={email}>
                State:
                <input
                  name="state"
                  type="text"
                  value={state}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor={zipcode}>
                Zip Code:
                <input
                  name="zipcode"
                  type="string"
                  value={zipcode}
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <div className="billingInfo">
              <h3>Payment Details</h3>
              <label htmlFor={nameOnCard}>
                Name on Card:
                <input
                  name="nameOnCard"
                  type="text"
                  value={nameOnCard}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor={ccNumber}>
                Credit Card Number:
                <input
                  name="ccNumber"
                  type="text"
                  value={ccNumber}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor={cvv}>
                CVV:
                <input
                  name="cvv"
                  type="number"
                  value={cvv}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor={billingZipcode}>
                Zip Code:
                <input
                  name="billingZipcode"
                  type="number"
                  value={billingZipcode}
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <input type="submit" value="Submit" id="submit" />
          </div>
        </form>
      </React.Fragment>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  let items
  if (state.user.id) {
    items = state.order.cartProducts
  } else {
    items = state.localCart
  }

  return {
    user: state.user,
    orderInfo: state.order.orderInfo,
    orderItems: items,
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchCart: (userId) => dispatch(fetchCart(userId)),
    checkoutCart: (cartId, user, address, payment) =>
      dispatch(_checkoutCart(cartId, user, address, payment)),
    loadUserData: () => dispatch(me()),
    loggedOutCheckout: (user, address, payment) =>
      dispatch(_checkoutLocalCart(user, address, payment)),
  }
}

export default connect(mapState, mapDispatch)(Checkout)
