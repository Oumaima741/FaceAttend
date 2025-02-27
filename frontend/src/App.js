import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import

import Home from './views/Home';
import FaceDetection from './views/FaceDetection';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div className="route">
            <Routes>
              {/* Updated syntax with 'element' prop */}
              <Route path="/" element={<Home />} />
              <Route path="/detection" element={<FaceDetection />} />
            </Routes>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
