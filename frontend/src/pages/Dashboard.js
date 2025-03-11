import React from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import "./Dashboard.css";  // Ton fichier de styles

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  // Données fictives juste pour voir l'affichage
  const fakeData = {
    labels: ["Catégorie 1", "Catégorie 2", "Catégorie 3"],
    datasets: [
      {
        label: "Données fictives",
        data: [15, 7, 10], // Valeurs arbitraires
        backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
      },
    ],
  };

  return (
    <div className="main-content">
      <h2>Tableau de Bord</h2>
      <p>(Les vraies données seront affichées plus tard)</p>
      <div className="chart-container">
        <Bar data={fakeData} />
      </div>
    </div>
  );
};

export default Dashboard;