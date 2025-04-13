import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch((error) => console.error("Erreur chargement des étudiants:", error));
  }, []);

  useEffect(() => {
    if (!selectedNiveau && !selectedFiliere) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (s) =>
          (!selectedNiveau || s.niveau === selectedNiveau) &&
          (!selectedFiliere || s.filiere === selectedFiliere)
      );
      setFilteredStudents(filtered);
    }
  }, [selectedNiveau, selectedFiliere, students]);

  const total = filteredStudents.length;
  const presents = Math.floor(total * 0.75);
  const absents = Math.floor(total * 0.15);
  const lates = total - presents - absents;

  const chartData = {
    labels: ["Présents", "Absents", "Retardataires"],
    datasets: [
      {
        label: "Taux de Présence",
        data: [presents, absents, lates],
        backgroundColor: ["#F48FB1", "#AED6F1", "#85C1E9"]
      }
    ]
  };

  const lineChartData = {
    labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
    datasets: [
      {
        label: "Évolution des Présences",
        data: [presents - 2, presents, presents + 1, presents - 1, presents + 2],
        borderColor: "#7FB3D5",
        borderWidth: 2,
        fill: false
      }
    ]
  };

  // ✅ Graphe des absences par heure pour chaque jour
  const getStudentPresenceData = (studentName) => {
    const heures = ["09:00", "11:00", "14:00", "16:00"];
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    const colors = ["#F1948A", "#AED6F1", "#A9DFBF", "#F7DC6F", "#D7BDE2"];

    // chaque dataset = un jour avec absences par heure
    const datasets = jours.map((jour, index) => {
      const absences = heures.map(() => (Math.random() < 0.5 ? 0 : 2));
      return {
        label: jour,
        data: absences,
        backgroundColor: colors[index]
      };
    });

    return {
      labels: heures,
      datasets: datasets
    };
  };

  return (
    <div className="dashboard-container">
      <h2>Tableau de Bord</h2>

      <div className="selection-container">
        <select value={selectedNiveau} onChange={(e) => setSelectedNiveau(e.target.value)}>
          <option value="">Tous les niveaux</option>
          <option value="1ère année">1ère année</option>
          <option value="2ème année">2ème année</option>
          <option value="3ème année">3ème année</option>
          <option value="4ème année">4ème année</option>
          <option value="5ème année">5ème année</option>
        </select>

        <select value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
          <option value="">Toutes les filières</option>
          <option value="Cycle préparatoire">Cycle préparatoire</option>
          <option value="BMS">BMS</option>
          <option value="QIF">QIF</option>
          <option value="SAGI">SAGI</option>
        </select>
      </div>

      <div className="stats-cards">
        <div className="card pink">
          <h3>{Math.floor((presents / total) * 100)}%</h3>
          <p>Présents</p>
        </div>
        <div className="card blue-light">
          <h3>{Math.floor((absents / total) * 100)}%</h3>
          <p>Absents</p>
        </div>
        <div className="card blue">
          <h3>{Math.floor((lates / total) * 100)}%</h3>
          <p>Retardataires</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <Bar data={chartData} />
        </div>
        <div className="chart">
          <Line data={lineChartData} />
        </div>
      </div>

      <div className="table-and-chart">
        <div className="table-container">
          <h3>Étudiants concernés</h3>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Filière</th>
                <th>Niveau</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => (
                <tr key={i} onClick={() => setSelectedStudent(s)} style={{ cursor: "pointer" }}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.filiere}</td>
                  <td>{s.niveau}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="selected-student-chart-side">
          <h3>
            {selectedStudent
              ? `Absence par créneau horaire de ${selectedStudent.name}`
              : "Sélectionne un étudiant pour voir ses absences"}
          </h3>
          <Bar
            data={getStudentPresenceData(selectedStudent?.name || "")}
            options={{
              responsive: true,
              scales: {
                y: {
                  title: {
                    display: true,
                    text: "Heures d’absence"
                  },
                  min: 0,
                  max: 8,
                  ticks: {
                    stepSize: 2
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: "Heure de la journée"
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
