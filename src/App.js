import React, { Component } from 'react';
import Layouts from './_components/Layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './_components/auth/Login';
import PrivateRoute from './_privateRoute/PrivateRoute';
import Dashboard from './_components/dashoard/Dashboard';
import Size from './_components/masters/Size';

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
          </Route>
          <Route path='*' element={<Login />} />
        </Routes>
      </Router>
    )
  }
}