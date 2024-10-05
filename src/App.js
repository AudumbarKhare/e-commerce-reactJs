import React, { Component } from 'react';
import Layouts from './_components/Layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './_components/auth/Login';
import PrivateRoute from './_privateRoute/PrivateRoute';
import Dashboard from './_components/dashoard/Dashboard';
import Size from './_components/masters/Size';
import Category from './_components/masters/Category';
import Color from './_components/masters/Color';
import Tag from './_components/masters/Tag';
import UserType from './_components/masters/UserType';
import BrandLogo from './_components/masters/BrandLogo';
import AddUser from './_components/users/AddUser';
import ListUser from './_components/users/ListUser';
import Profile from './_components/settings/profile';
import Orders from './_components/sales/Orders';
import Transactions from './_components/sales/Transactions';
import Reports from './_components/reports/Reports';
import Invoice from './_components/invoice/Invoice';
import ProductList from './_components/products/physical/ProductList';
import AddProduct from './_components/products/physical/AddProduct';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/auth/login' element={<Login />} />
          <Route path='/' element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path='/masters/size' element={<Size />} />
            <Route path='/masters/category' element={<Category />} />
            <Route path='/masters/color' element={<Color />} />
            <Route path='/masters/tag' element={<Tag />} />
            <Route path='/masters/usertype' element={<UserType />} />
            <Route path='/masters/brandlogo' element={<BrandLogo />} />

            <Route path='/sales/orders' element={<Orders />} />
            <Route path='/sales/transactions' element={<Transactions />} />

            <Route path='/products/physical/productList' element={<ProductList />} />
            <Route path='/products/physical/addProduct' element={<AddProduct />} />

            <Route path='/users/addUser' element={<AddUser />} />
            <Route path='/users/listUser' element={<ListUser />} />

            <Route path='/settings/profile' element={<Profile />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/invoice' element={<Invoice />} />
          </Route>
          <Route path='*' element={<Login />} />
        </Routes>
      </Router>
    )
  }
}