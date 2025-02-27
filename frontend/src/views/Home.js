import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>📸 Détection de Présence des Étudiants</h1>
            <Link 
                to="/detection" 
                style={{
                    display: 'inline-block', 
                    padding: '10px 20px', 
                    fontSize: '18px', 
                    textDecoration: 'none', 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
                Démarrer la Détection
            </Link>
        </div>
    );
};

export default Home;
