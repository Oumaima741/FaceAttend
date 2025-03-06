import React, { useState } from 'react';
import { FaRoute , FaSignOutAlt, FaUserTie, FaUsers, FaCog, FaQuestionCircle, FaHome, FaUser, FaChartBar, FaCar, FaDatabase } from 'react-icons/fa';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeItem, onItemClick }) => {

  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li onClick={() => onItemClick('dashboard')}>
          <div className="sidebar-link">
            <FaHome className="sidebar-icon" />
            <span className="sidebar-text">Tableau de bord</span>
          </div>
        </li>
        <li>
          <div className="sidebar-link">
            <FaCar className="sidebar-icon" />
            <span className="sidebar-text">Gestion des étudiants</span>
          </div>
        </li>
        <li onClick={() => onItemClick('FaceDetection')}>
          <div className="sidebar-link">
            <FaUserTie className="sidebar-icon" />
            <span className="sidebar-text">Détection faciale</span>
          </div>
        </li>

        <li onClick={() => onItemClick('Support')}>
          <div className="sidebar-link">
            <FaQuestionCircle className="sidebar-icon" />
            <span className="sidebar-text">Assistance & Aide</span>
          </div>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
