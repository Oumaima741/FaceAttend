import React, { useState } from 'react'; // Importez useRef depuis React
import './Navbar.css';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';

function Navbar({ }) {


  return (
    <div className="navbar-wrapper" >
      <nav className="navbar">
        <div className="Logo"> FaceAttend </div>
        <div className="menu-icon" >
          <FaBars />
         </div>
        <div >
          <ul className="nav-items">
            <li className="nav-item" >
              <a href="/">
                 Accueil
              </a>
            </li>
            <li className="nav-item" >
              <a href="/#section6">
                Comment ça marche ?  
              </a>
            </li>
        <li className="nav-item">
        <a href="">
           <FaUserCircle size={24} />
           </a>
        </li>

          </ul>
        </div>

      </nav>

    </div>
  );
}

export default Navbar;
