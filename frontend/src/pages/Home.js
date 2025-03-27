import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import './Home.css';
import image1 from '../images/image1.png'; 
import image2 from '../images/image2.png';
import { FaUserCheck, FaClock, FaChartBar, FaShieldAlt, FaUser, FaClipboardList } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate('/login');
  };
  
  return (
    <div className='content'>
      <Navbar />
      <div className="section1">
        <h2>OPTIMISEZ LE SUIVI DE PRÉSENCE & RENFORCEZ LA SÉCURITÉ</h2>
        <h1 className="title">Simplifiez la Détection de Présence avec AttendTrack</h1>
        <p className="description">AttendTrack offre une solution intuitive et efficace pour surveiller la présence en temps réel, gérer les accès et générer des rapports détaillés.</p>
        <button className="cta-button" onClick={handleClick}>Commencer</button>
      </div>
      <div className='section2' id='section2'>
        <div className="solutions">
          <FaUserCheck className="solutions-icon" />
          <h3 className="solutions-title">Suivi de Présence en Temps Réel</h3>
          <p className="solutions-description">Surveillez la présence et l'état des présences en temps réel pour assurer des enregistrements précis et sécurisés.</p>
        </div>
        <div className="solutions">
          <FaClock className="solutions-icon" />
          <h3 className="solutions-title">Gestion Automatisée du Temps</h3>
          <p className="solutions-description">Suivez automatiquement les heures d'entrée et de sortie pour une gestion optimisée des effectifs.</p>
        </div>
        <div className="solutions">
          <FaShieldAlt className="solutions-icon" />
          <h3 className="solutions-title">Contrôle d'Accès Sécurisé</h3>
          <p className="solutions-description">Renforcez la sécurité en gérant et restreignant l'accès en fonction des données de présence.</p>
        </div>
        <div className="solutions">
          <FaUser className="solutions-icon" />
          <h3 className="solutions-title">Suivi des Employés</h3>
          <p className="solutions-description">Obtenez des informations sur les habitudes de présence pour améliorer l'efficacité de l'équipe.</p>
        </div>
        <div className="solutions">
          <FaChartBar className="solutions-icon" />
          <h3 className="solutions-title">Analyses & Rapports</h3>
          <p className="solutions-description">Générez des rapports détaillés et des analyses pour le suivi des présences et la conformité.</p>
        </div>
        <div className="solutions">
          <FaClipboardList className="solutions-icon" />
          <h3 className="solutions-title">Alertes Personnalisées</h3>
          <p className="solutions-description">Configurez des notifications pour les retards, absences ou tentatives d'accès non autorisées.</p>
        </div>
      </div>
      <div className='section3' id='why_attendtrack'>
        <div>
          <img src={image1} alt="" className="responsive-image"  />
          <img src={image2} alt="" className="responsive-image"  />
        </div>
        <div>
          <h2>Système de Gestion de Présence : AttendTrack</h2>
          <p>Optimisez la gestion des effectifs et la sécurité avec AttendTrack. Simplifiez les opérations et améliorez l'efficacité.</p>
          <blockquote>“Une solution fluide pour le suivi des présences et le contrôle d'accès”</blockquote>
          <p>
            Que vous gériez un bureau, une école ou un site industriel, AttendTrack vous aide à surveiller les présences efficacement. Avec un suivi en temps réel, des rapports automatisés et un contrôle d'accès sécurisé, notre système garantit fiabilité et précision.
          </p>
        </div>
      </div>
      <div className="section6" id='section6'>
        <div className="how-it-works">
          <h2>Comment fonctionne AttendTrack</h2>
          <ul>
            <li>
              <h3>Inscription</h3>
              <p>Créez votre compte AttendTrack et commencez à gérer la présence facilement.</p>
            </li>
            <li>
              <h3>Configuration des Points d'Accès</h3>
              <p>Intégrez notre système avec des scanners biométriques, RFID ou check-ins mobiles.</p>
            </li>
            <li>
              <h3>Suivi en Temps Réel</h3>
              <p>Surveillez les données de présence et recevez des mises à jour instantanées.</p>
            </li>
            <li>
              <h3>Génération de Rapports</h3>
              <p>Analysez les tendances et exportez des rapports détaillés pour une meilleure prise de décision.</p>
            </li>
          </ul>
        </div>
        <div className="video" >
          
        <iframe width="560" height="315" src="https://www.youtube.com/embed/EHgjYXWtaIs"  allowFullScreen title=''></iframe>
        </div>
      </div>
      <div className="section4" id='Our_Story'>
        <div className="container">
          <div className="story-content">
            <h2 className="section-title">Notre Vision : Transformer la Gestion des Présences</h2>
            <p className="section-description">
              AttendTrack est né du besoin d'une solution efficace et sécurisée pour la détection de présence. Notre équipe a développé un système innovant simplifiant le suivi des présences, garantissant fiabilité et conformité.
            </p>
          </div>
        </div>
      </div>
      <section id="get-in-touch">
        <div className="container">
          <h2>Optimisez votre Gestion de Présence dès Aujourd'hui</h2>
          <p>Contactez-nous pour planifier une démonstration ou découvrir comment AttendTrack peut améliorer l'efficacité de votre organisation.</p>
        </div>
        <form className="contact-form">
            <div className="form-group">
              <input type="text" placeholder="Your Name" required/>
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required/>
            </div>
            <div className="form-group">
              <input type="tel" placeholder="Your Phone Number" required/>
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" required></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>

      </section>
      <footer>
        <div className="footer-links">
          <a href="#">Accueil</a>
          <a href="#">Fonctionnalités</a>
          <a href="#">À Propos</a>
          <a href="#">Contact</a>
          <a href="#">Politique de Confidentialité</a>
        </div>
        <div className="copyright">
          <p>© 2024 AttendTrack. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
