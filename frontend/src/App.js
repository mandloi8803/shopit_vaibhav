import {useEffect} from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Header from './components/layout/Header'
import './App.css';
import ProtectedRoute from './components/route/ProtectedRoute'
import Footer from './components/layout/Footer'
import Home from './components/Home'
import Profile from './components/user/Profile'
import ProductDetails from './components/product/ProductDetails'
import Login from './components/user/Login'
import Register from './components/user/Register'
import {loadUser} from './actions/userActions'
import store from './store'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword'
import Cart from './components/cart/Cart'
function App() {
  useEffect(()=>{
    store.dispatch(loadUser())
  },[])
  return (
    <Router>
    <div className="App">
      <Header />
      <div className="container container-fluid">
        <Route path="/" component={Home} exact />
        <Route path="/search/:keyword" component={Home} />
        <Route path="/product/:id" component={ProductDetails}exact/>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register} />
      <Route path="/me" component={Profile}exact />
      <Route path="/me/update" component={UpdateProfile}exact />
      <Route path="/password/update" component={UpdatePassword}exact />
      <Route path="/password/forgot" component={ForgotPassword}exact />
      <Route path="/password/reset/:token" component={NewPassword}exact />
      <Route path="/cart" component={Cart}exact />
      </div>
      
      <Footer />
     </div>
     </Router>
      );
}

export default App;