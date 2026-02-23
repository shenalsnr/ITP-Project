import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Customer from "./components/Customer/Customer.jsx"; 
import Homepage from "./components/Homepage/Homepage.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
import ContactUs from "./components/ContactUs/ContactUs.jsx";
import AdminDash from "./components/AdminDash/AdminDash.jsx";
import ProductPage from "./components/productpage/productpage.jsx";
import Cart from "./components/Cart/Cart.jsx";
import CusProfile from "./components/CusProfile/CusProfile.jsx";

import Product from "./components/Seller/Product.jsx";
import AllProduct from "./components/Seller/Allproduct.jsx";
import Addsellerdashboard from "./components/Seller/Addsellerdashboard.jsx";
import Addproduct from "./components/Seller/Addproduct.jsx";

import Checkout from "./components/Checkout/Checkout.jsx";
import Payment from "./components/Checkout/Payment.jsx"
import Orders from "./components/Checkout/Orders.jsx";
import AdminList from "./components/AdminList/AdminList.jsx";

import Sellerdashboard from "./components/Seller/Sellerdashboard.jsx";
import Inventory from "./components/Inventory/Inventory.jsx";
import AddSellerDashboard from "./components/Inventory/AddSellerDashboard.jsx";
import ListProduct from "./components/Inventory/ListProduct.jsx";
import AddSellerList from "./components/Inventory/AddSellerList.jsx";

import  ForgotPassword from "./components/ForgotPassword/ForgotPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy.jsx";


import Dashboard from './components/Support/Dashboard';
import SupportForm from './components/Support/SupportForm';
import Chatbot from './components/Support/Chatbot';
import SupportAgentProfileForm from "./components/Support/profile.jsx";






{/*testrtty*/}
function App() {
  return (
    <Router>
      
      <Routes>

        
        <Route path="/" element={<Homepage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/shop" element={<AllProduct/>}/>


        <Route path="/login" element={<Login />} /> 

          <Route path="/profile" element={<ProtectedRoute><CusProfile /></ProtectedRoute>}/>

        <Route path="/ForgotPassword" element={<ForgotPassword />} /> 

        <Route path="/Register" element={<Register />} />


        <Route path="/AdminDash/*" element={<AdminDash />} />
        <Route path="/Addsellerdashboard" element={<Addsellerdashboard/>} />
        <Route path="Customer" element={<Customer />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/CusProfile" element={<CusProfile/>}/>


        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />


        
         <Route path="/CusProfile" element={<CusProfile/>}/>
          <Route path="/listproduct" element={<Addproduct/>}/>
           <Route path="/Add" element={<Addsellerdashboard/>}/>
            <Route path="/product/:id" element={<Product/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/payment" element={<Payment/>}/>
            <Route path="/orders" element={<Orders/>}/>
            <Route path="/Continue" element={<AllProduct/>}/>

            <Route path="/AdminList" element={<AdminList/>} />



      

            <Route path="/store" element={<Sellerdashboard/>}/>
             <Route path="/linkto/:id" element={<Product/>}/>
            <Route path="/inventory" element={<Inventory/>}/>
            <Route path="/listdata" element={<ListProduct/>}/>
            <Route path="/add-seller" element={<AddSellerDashboard/>}/>
            <Route path="/Slist" element={<AddSellerList/>}/>
             <Route path="/server" element={<AddSellerDashboard/>}/>



          <Route path="/add" element={<SupportForm />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/profile" element={<SupportAgentProfileForm/>} />
          <Route path="/list" element={<Dashboard />} />




      </Routes>
    </Router>
  );
}

export default App;
