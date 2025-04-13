import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; 
import Navbar from '../components/Navbar';
import Attendence from './Attendence';
import Dashboard from './Dashboard';
import './DashboardLayout.css';
import FaceDetection from './FaceDetection';
import Aid from './Aid';
const DashboardLayout = () => {
  const [content, setContent] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState('Vehicle');

  const handleSidebarItemClick = (item) => {
    setContent(item);
  };

  const handleImportDataClick = () => {
    setContent('General_Data'); 
  };

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
          {content === 'Aid' && <Aid/>}
          
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
