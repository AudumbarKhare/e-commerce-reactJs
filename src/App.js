import React, { Component } from 'react';
import Layouts from './_components/Layout';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layouts />
      </BrowserRouter>
    )
  }
}