import { ADD_TO_CART, REMOVE_CART_ITEM
 } from "../Constants/cartConstant";
 import axios
  from "axios";

  export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/products/${id}`);
  
    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.Stock,
        quantity,
      },
    });
  
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };
  
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

