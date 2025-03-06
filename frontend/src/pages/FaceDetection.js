import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

const FaceDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'; // Place tes fichiers modèles dans public/models
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            setModelsLoaded(true);
        };

        loadModels();
    }, []);

    useEffect(() => {
        if (modelsLoaded) {
            // Vérification si videoRef.current est défini avant d'utiliser le flux vidéo
            if (videoRef.current) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        videoRef.current.srcObject = stream;
                    })
                    .catch(err => console.error("Erreur caméra : ", err));
            }
        }
    }, [modelsLoaded]);

    useEffect(() => {
      const detectAndDraw = async () => {
          if (videoRef.current && modelsLoaded) {
              try {
                  // Attente explicite que le modèle soit chargé avant la détection
                  const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                      .withFaceLandmarks()
                      .withFaceDescriptors();
  
                  // Si aucune détection n'est trouvée, loggez un message d'erreur
                  if (detections.length === 0) {
                      console.log('Aucun visage détecté');
                  } else {
                      console.log('Visages détectés : ', detections);
                  }
  
                  const canvas = canvasRef.current;
                  const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
                  faceapi.matchDimensions(canvas, displaySize);
  
                  const resizedDetections = faceapi.resizeResults(detections, displaySize);
                  const context = canvas.getContext('2d');
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  faceapi.draw.drawDetections(canvas, resizedDetections);
                  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
              } catch (error) {
                  console.error("Erreur de détection des visages : ", error);
              }
          }
      };
  
      const interval = setInterval(detectAndDraw, 1000);
      return () => clearInterval(interval);
  }, [modelsLoaded]);
  

    // Ne pas oublier de vérifier l'ordre des appels
    const handleImageDetection = async () => {
        if (modelsLoaded) {
            const img = await faceapi.fetchImage('/img/test.jpeg');
            const detections = await faceapi.detectAllFaces(img)
                .withFaceLandmarks()
                .withFaceDescriptors();
            console.log("Détections image :", detections);
        }
    };

    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Page de Détection Faciale</h2>
          <video ref={videoRef} autoPlay muted width="640" height="480"></video>
          <canvas ref={canvasRef} style={{ position: 'absolute', top: '0', left: '0' }} />
      </div>
    );
};

export default FaceDetection;
