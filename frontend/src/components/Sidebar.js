import React from 'react';
import { FaUserTie, FaUsers, FaQuestionCircle, FaHome } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ activeItem, onItemClick }) => {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li className={`sidebar-item ${activeItem === "dashboard" ? "active" : ""}`} 
            onClick={() => onItemClick("dashboard")}>
          <div className="sidebar-link">
            <FaHome className="sidebar-icon" />
            <span className="sidebar-text">Tableau de bord</span>
          </div>
        </li>

        <li className={`sidebar-item ${activeItem === "Attendence" ? "active" : ""}`} 
            onClick={() => onItemClick("Attendence")}>
          <div className="sidebar-link">
            <FaUsers className="sidebar-icon" />
            <span className="sidebar-text">Gestion des étudiants</span>
          </div>
        </li>

        <li className={`sidebar-item ${activeItem === "FaceDetection" ? "active" : ""}`} 
            onClick={() => onItemClick("FaceDetection")}>
          <div className="sidebar-link">
            <FaUserTie className="sidebar-icon" />
            <span className="sidebar-text">Détection faciale</span>
          </div>
        </li>

        <li className={`sidebar-item ${activeItem === "Aid" ? "active" : ""}`} 
            onClick={() => onItemClick("Aid")}>
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
