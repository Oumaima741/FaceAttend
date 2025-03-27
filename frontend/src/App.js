import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import DashboardLayout from './pages/DashboardLayout'; 
import Home from './pages/Home';
import './App.css';
import SignUp from "./pages/SignUp"; // 👈 Ajoute ceci
import Login from "./pages/Login"; 
class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div className="route">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/DashboardLayout" element={<DashboardLayout />} />
            </Routes>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
