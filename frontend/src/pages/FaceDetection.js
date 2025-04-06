import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import AuthIdle from "../assets/images/auth-idle.svg";
import AuthFace from "../assets/images/auth-face.svg";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./FaceDetection.css";

function FaceDetection() {
  const [localUserStream, setLocalUserStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [PresenceResult, setPresenceResult] = useState("PENDING");
  const [imageError, setImageError] = useState(false);
  const [counter, setCounter] = useState(5);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceApiIntervalRef = useRef();
  const videoWidth = 640;
  const videoHeight = 360;
  const descriptorsLoaded = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  const loadModels = async () => {
    const uri = "/models";
    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
  };

  useEffect(() => {
    loadModels()
      .then(async () => {
        const descriptors = await loadLabeledImages();
        if (descriptors && descriptors.length > 0) {
          setLabeledFaceDescriptors(descriptors);
        }
      })
      .then(() => setModelsLoaded(true))
      .catch(error => {
        console.error("Error loading models:", error);
        setImageError(true);
      });
  }, []);

  useEffect(() => {
    if (PresenceResult === "SUCCESS") {
      const counterInterval = setInterval(() => {
        setCounter((counter) => counter - 1);
      }, 1000);

      if (counter === 0) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        localUserStream.getTracks().forEach((track) => {
          track.stop();
        });
        clearInterval(counterInterval);
        clearInterval(faceApiIntervalRef.current);
        localStorage.setItem("faceAuth", JSON.stringify({ status: true }));
        navigate("/success"); // Redirect to success page
      }

      return () => clearInterval(counterInterval);
    }
    setCounter(5);
  }, [PresenceResult, counter]);

  const getLocalUserVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setLocalUserStream(stream);
      })
      .catch((err) => {
        console.error("error:", err);
        setImageError(true);
      });
  };

  const scanFace = async () => {
    if (!descriptorsLoaded.current) {
      console.log("Attente des descripteurs...");
      await new Promise(resolve => {
        const check = () => {
          if (descriptorsLoaded.current) resolve();
          else setTimeout(check, 100);
        };
        check();
      });
    }

    console.log("Descripteurs disponibles:", labeledFaceDescriptors);
    
    if (!labeledFaceDescriptors) {
      console.error("Les descripteurs ne sont toujours pas chargés");
      return;
    }

    faceapi.matchDimensions(canvasRef.current, videoRef.current);

    const faceApiInterval = setInterval(async () => {
      if (!videoRef.current) return;

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, {
          width: videoWidth,
          height: videoHeight,
        });

        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
        const results = resizedDetections.map((d) =>
          faceMatcher.findBestMatch(d.descriptor)
        );

        if (!canvasRef.current) return;

        canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, videoWidth, videoHeight);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        if (results.length > 0 && results[0].label !== "unknown") {
          setPresenceResult("SUCCESS");
        } else {
          setPresenceResult("FAILED");
        }

        if (!faceApiLoaded) setFaceApiLoaded(true);
      } catch (error) {
        console.error("Face detection error:", error);
      }
    }, 1000 / 15);

    faceApiIntervalRef.current = faceApiInterval;
  };

  async function loadLabeledImages() {
    try {
      console.log("Début du chargement des images...");
      const response = await fetch("http://localhost:5000/api/getAllImages");
      
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      const students = await response.json();
      console.log("Données reçues:", students);
  
      // Vérification approfondie des images
      if (!students || students.length === 0) {
        throw new Error("Aucune donnée d'étudiant reçue");
      }
  
      const validDescriptors = [];
      
      for (const student of students) {
        try {
          if (!student.photo) {
            console.warn(`Étudiant ${student.id} n'a pas de photo`);
            continue;
          }
  
          // Vérification du format de l'image
          let imageSrc = student.photo;
          if (!imageSrc.startsWith('data:image/')) {
            imageSrc = `data:image/jpeg;base64,${imageSrc}`;
          }
  
          console.log(`Traitement de l'étudiant ${student.id}...`);
          
          // Création de l'élément image
          const img = await createImageElement(imageSrc);
          
          // Détection du visage
          const detection = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
  
          if (detection) {
            validDescriptors.push(detection.descriptor);
            console.log(`Visage détecté pour l'étudiant ${student.id}`);
          } else {
            console.warn(`Aucun visage détecté pour l'étudiant ${student.id}`);
          }
        } catch (error) {
          console.error(`Erreur sur l'étudiant ${student.id}:`, error);
        }
      }
  
      if (validDescriptors.length === 0) {
        throw new Error("Aucun descripteur facial valide n'a pu être créé");
      }
  
      console.log(`${validDescriptors.length} descripteurs créés avec succès`);

      const descriptors = new faceapi.LabeledFaceDescriptors("knownFaces", validDescriptors);
      setLabeledFaceDescriptors(descriptors);
      descriptorsLoaded.current = true; // Marquer comme chargé
      console.log("Descripteurs enregistrés dans l'état");
      
      return new faceapi.LabeledFaceDescriptors("knownFaces", validDescriptors);
      



    } catch (error) {
      console.error("Erreur fatale:", error);
      setImageError(true);
      return null;
    }
  }
  
  // Fonction utilitaire pour créer un élément image
  async function createImageElement(src) {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Échec du chargement de l\'image'));
    });
  }

  if (imageError) {
    return (
      <div className="error-message">
        <h2>Error loading face recognition data</h2>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-[24px] max-w-[720px] mx-auto">
      {!localUserStream && !modelsLoaded && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">
            You're Attempting to Mark your presence With Your Face.
          </span>
          <span className="block text-indigo-600 mt-2">Loading Models...</span>
        </h2>
      )}
      {!localUserStream && modelsLoaded && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-indigo-600 mt-2">
            Please Recognize Your Face to Completely marke.
          </span>
        </h2>
      )}
      {localUserStream && PresenceResult === "SUCCESS" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-indigo-600 mt-2">
            We've successfully recognize your face!
          </span>
          <span className="block text-indigo-600 mt-2">
            Please stay {counter} more seconds...
          </span>
        </h2>
      )}
      {localUserStream && PresenceResult === "FAILED" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-rose-700 sm:text-4xl">
          <span className="block mt-[56px]">
            Upps! We did not recognize your face.
          </span>
        </h2>
      )}
      {localUserStream && !faceApiLoaded && PresenceResult === "PENDING" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block mt-[56px]">Scanning Face...</span>
        </h2>
      )}
      <div className="w-full">
        <div className="relative flex flex-col items-center p-[10px]">
          <video
            muted
            autoPlay
            ref={videoRef}
            height={videoHeight}
            width={videoWidth}
            onPlay={scanFace}
            style={{
              objectFit: "fill",
              height: "360px",
              borderRadius: "10px",
              display: localUserStream ? "block" : "none",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              display: localUserStream ? "block" : "none",
            }}
          />
        </div>
        {!localUserStream && (
          <>
            {modelsLoaded ? (
              <>
                <img
                  alt="loading models"
                  src={AuthFace}
                  className="cursor-pointer my-8 mx-auto object-cover h-[272px]"
                />
                <button
                className="scane-button"
                  onClick={getLocalUserVideo}
                  type="button"                >
                  Scanne mon visage
                </button>
              </>
            ) : (
              <>
                <img
                  alt="loading models"
                  src={AuthIdle}
                  className="model-loading"
                />
                <button
                  disabled
                  type="button"
                  className="cursor-not-allowed flex justify-center items-center w-full py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 inline-flex items-center"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="loading"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Veuillez patienter pendant que les modèles se chargent...
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FaceDetection;