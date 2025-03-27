import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import "./Attendence.css";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const webcamRef = useRef(null);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", id: "", filiere: "", niveau: "" });
  const [uploadPhoto, setUploadPhoto] = useState(null);

  const fetchStudents = () => {
    axios.get("http://localhost:5000/students")
      .then(response => setStudents(response.data))
      .catch(error => console.error("Erreur lors du chargement des données:", error));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhoto(imageSrc);
      setShowCamera(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const resizedDataUrl = canvas.toDataURL("image/jpeg");
        setUploadPhoto(resizedDataUrl);
        setPhoto(resizedDataUrl);
      };
      img.src = reader.result;
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSaveStudent = () => {
    if (newStudent.name && newStudent.email && newStudent.id && newStudent.filiere && newStudent.niveau) {
      const studentToSave = { ...newStudent, photo: photo || uploadPhoto };

      if (editMode) {
        const updatedStudents = [...students];
        updatedStudents[currentIndex] = studentToSave;
        setStudents(updatedStudents);
        setEditMode(false);
      } else {
        axios.post("http://localhost:5000/students", studentToSave)
          .then(() => {
            fetchStudents();
          })
          .catch((err) => {
            console.error("Erreur lors de l’ajout :", err);
            alert("Erreur d’enregistrement !");
          });
      }

      setShowModal(false);
      setPhoto(null);
      setUploadPhoto(null);
      setNewStudent({ name: "", email: "", id: "", filiere: "", niveau: "" });
    } else {
      alert("Veuillez remplir tous les champs !");
    }
  };

  const handleEditStudent = (index) => {
    setNewStudent(students[index]);
    setPhoto(students[index].photo || null);
    setCurrentIndex(index);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteStudent = (index) => {
    const studentToDelete = students[index];
    axios.delete(`http://localhost:5000/students/${studentToDelete.id}`)
      .then(() => {
        const updatedStudents = students.filter((_, i) => i !== index);
        setStudents(updatedStudents);
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression:", err);
        alert("Suppression échouée");
      });
  };

  return (
    <div className="attendance-container">
      <div className="header">
        <h2>Gestion des Étudiants</h2>
        <button className="add-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>➕ Ajouter un étudiant</button>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>Numéro d'inscription</th>
            <th>Nom</th>
            <th>Filière</th>
            <th>Niveau d'étude</th>
            <th>Email</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.filiere}</td>
              <td>{student.niveau}</td>
              <td>{student.email}</td>
              <td>
                {student.photo ? <img src={student.photo} alt="Photo" className="student-photo" /> : "Pas de photo"}
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEditStudent(index)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDeleteStudent(index)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
            {!showCamera ? (
              <>
                <h2>{editMode ? "Modifier l'étudiant" : "Ajouter un étudiant"}</h2>
                <input type="text" placeholder="Nom de l'étudiant" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
                <input type="email" placeholder="Adresse e-mail" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
                <input type="text" placeholder="Numéro d'inscription" value={newStudent.id} onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })} />
                <select value={newStudent.filiere} onChange={(e) => setNewStudent({ ...newStudent, filiere: e.target.value })}>
                  <option disabled hidden value="">Choisir la filière</option>
                  <option value="Cycle préparatoire">Cycle préparatoire</option>
                  <option value="BMS">BMS</option>
                  <option value="QIF">QIF</option>
                  <option value="SAGI">SAGI</option>
                </select>
                <select value={newStudent.niveau} onChange={(e) => setNewStudent({ ...newStudent, niveau: e.target.value })}>
                  <option disabled hidden value="">Choisir le niveau d'étude</option>
                  <option value="1ère année">1ère année</option>
                  <option value="2ème année">2ème année</option>
                  <option value="3ème année">3ème année</option>
                  <option value="4ème année">4ème année</option>
                  <option value="5ème année">5ème année</option>
                </select>

                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <p>OU</p>
                {!photo && <button className="camera-btn" onClick={() => setShowCamera(true)}>📸 Prendre une photo</button>}
                {photo && (
                  <div className="photo-preview">
                    <img src={photo} alt="Photo étudiante" />
                  </div>
                )}

                <button className="save-btn" onClick={handleSaveStudent}>💾 {editMode ? "Modifier" : "Sauvegarder"}</button>
              </>
            ) : (
              <>
                <h2>Prendre une photo</h2>
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="webcam-view" />
                <button className="camera-btn" onClick={capturePhoto}>📷 Capturer</button>
                <button className="return-btn" onClick={() => setShowCamera(false)}>Retour</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
