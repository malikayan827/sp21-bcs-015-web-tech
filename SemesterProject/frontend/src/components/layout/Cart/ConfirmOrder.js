import React, { Fragment } from 'react'
import CheckoutSteps from './CheckoutSteps'

import { useSelector } from 'react-redux'
import MetaData from '../MetaData'
import "./ConfirmOrder.css"
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const ConfirmOrder = () => {
    const { shippingInfo ,cartItems} = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.user)
    const navigate = useNavigate()
    // Calculate Order Prices
    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
    const shipping = subtotal > 1000 ? 0 : 200
    const totalPrice = subtotal + shipping
    const proceedToCheckout = () => {
        const data = {
            subtotal: subtotal,
            shipping: shipping,
            totalPrice: totalPrice
        }
        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/process/payment')
    }


    return (
        <Fragment>
            <MetaData title='Confirm Order' />
            <CheckoutSteps activeStep={1}/>
        
            <div className='confirmOrderPage'>
                <div className='confirmShippingArea'>
                    <Typography>Shipping Info</Typography>
                    <div className='confirmShippingAreaBox'>
                        <div>
                            <p>Name: </p>
                            <span>{user.name}</span>
                        </div>
                        <div>
                            <p>Phone: </p>
                            <span>{shippingInfo.phoneNo}</span>
                        </div>
                        <div>
                            <p>Address: </p>
                            <span>{`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</span>
                        </div>    

                    </div>
                </div>
                <div className='confirmCartItems'>
                    <Typography>Cart Items:</Typography>

                    <div className='confirmCartItemsContainer'>
                        {cartItems && cartItems.map((item) => (
                            <div key={item.product}>
                                <img src={item.image} alt={item.name} />
                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                {" "}
                                <span>{item.quantity} x ${item.price} ={" "} <b>${item.quantity * item.price}</b></span>   

                            </div>
                        ))}
                        </div>

                </div>
            </div>
            {/* */}
            <div>
                <div className='orderSummary'>
                    <Typography>Order Summary</Typography>
                    <div >
                        <div>
                            <p>Subtotal :</p>
                            <span>${subtotal}</span>
                        </div>
                        <div>
                            <p>Shipping:</p>
                            <span>${shipping}</span>
                        </div>
                        <div className='orderSummaryTotal'>
                            <p><b>Total:</b></p>
                            <span>${totalPrice}</span>

                        </div>
                        <button onClick={proceedToCheckout}  className='proceedToCheckout'>Proceed to Payment</button>
                        
                    </div>
                    </div>
            </div>
        </Fragment>
    )
}

export default ConfirmOrder