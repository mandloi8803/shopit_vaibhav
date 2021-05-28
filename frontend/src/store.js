import{ createStore,combineReducers,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import { productReducer,productDetailsReducer } from './reducers/productReducers'
import {authReducer,userReducer,ForgotPasswordReducer} from './reducers/userReducer'
import {cartReducer} from './reducers/cartReducer'
const reducer = combineReducers({
      products: productReducer,
      productDetails: productDetailsReducer,
      auth:authReducer,
      user:userReducer,
      forgotPassword:ForgotPasswordReducer,
      cart:cartReducer
})

let initialState = {
      cart:{
            cartItems:localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
      :[]
      }
}

const middleware = [thunk];
const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware))) 
export default store;