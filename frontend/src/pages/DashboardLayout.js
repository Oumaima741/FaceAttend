import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; 
import Navbar from '../components/Navbar';
import Attendence from './Attendence';
import Dashboard from './Dashboard';
import './DashboardLayout.css';
import FaceDetection from './FaceDetection';
import { Link } from 'react-router-dom'; 
import axios from 'axios';

const DashboardLayout = () => {
  const [content, setContent] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState('Vehicle');

  // Function to update content based on sidebar item click
  const handleSidebarItemClick = (item) => {
    setContent(item);
  };

  // Function to handle "Import Data" button click
  const handleImportDataClick = () => {
    setContent('General_Data'); 
  };

  // Handle navbar item click
  const handleNavbarItemClick = (item) => {
    setSelectedItem(item); 
  };

  return (
    <div className="layout">
      <div className="Navbar-content">
        <Navbar content={content} onItemClick={handleNavbarItemClick} />
      </div>
      <div className="dashboard-content">
        <div className="sidebar">
          <Sidebar activeItem={content} onItemClick={handleSidebarItemClick} />
        </div>
        <div className="main-content">
          {content === 'dashboard' && <Dashboard />}
          {content === 'FaceDetection' && <FaceDetection />}
          {content === 'Attendence' && <Attendence/>}
          
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
