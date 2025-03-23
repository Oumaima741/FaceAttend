import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

const FaceDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Fonction de démarrage de la vidéo
    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: { width: 720, height: 560 } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error('Erreur de récupération du flux vidéo', err));
    };
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models')
      ])
      .then(() => {
        console.log('Models loaded');
        startVideo();
      })
      .catch((err) => {
        console.error('Error loading models:', err);
      });
      

    // Fonction pour la détection des visages lorsque la vidéo commence
    const handlePlay = () => {
      const video = videoRef.current;
      const canvas = faceapi.createCanvasFromMedia(video);
      if (canvasRef.current) {
        canvasRef.current.appendChild(canvas);
      }

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detectFaces = async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
          .withFaceLandmarks()
          .withFaceExpressions();
      
        console.log(detections); // Afficher les résultats pour vérifier les landmarks
      
        if (detections.length > 0) {
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); // Clear previous detections
          faceapi.draw.drawDetections(canvas, resizedDetections); // Dessiner les boîtes de détection
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // Dessiner les landmarks
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // Dessiner les expressions
        }
      };
      

      const intervalId = setInterval(detectFaces, 100);
      return () => clearInterval(intervalId); // Nettoyage de l'intervalle au démontage du composant
    };

    // Ajouter un événement de lecture pour commencer la détection
    videoRef.current?.addEventListener('play', handlePlay);

    return () => {
      // Nettoyage des ressources
      videoRef.current?.removeEventListener('play', handlePlay);
      if (canvasRef.current) {
        canvasRef.current.innerHTML = ''; // Clear canvas on unmount
      }
    };
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="relative flex flex-col items-center p-[10px]">
        <video
          muted
          autoPlay
          ref={videoRef}
          width={720}
          height={560}
          style={{
            objectFit: "contain", 
            height: "600px",
            width: "100%",
            borderRadius: "10px",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default FaceDetection;
