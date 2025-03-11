import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

const FaceDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'; // Place tes fichiers modèles dans public/models
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
                await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
                setModelsLoaded(true);
            } catch (error) {
                console.error('Erreur de chargement des modèles : ', error);
            }
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
                    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({
                        inputSize: 512,
                        scoreThreshold: 0.5
                    }))
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                    if (detections.length === 0) {
                        console.log('Aucun visage détecté');
                    } else {
                        console.log('Visages détectés : ', detections);
                    }

                    const canvas = canvasRef.current;
                    const displaySize = { width: videoRef.current.width, height: videoRef.current.height };

                    // Redimensionner le canevas pour correspondre à la taille de la vidéo
                    faceapi.matchDimensions(canvas, displaySize);

                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    const context = canvas.getContext('2d');
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    // Dessiner les détections et les repères faciaux
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

    useEffect(() => {
        // Cleanup video stream on component unmount
        return () => {
            const stream = videoRef.current?.srcObject;
            const tracks = stream?.getTracks();
            tracks?.forEach(track => track.stop());
        };
    }, []);

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
        <div style={{ position: 'relative', width: '640px', margin: 'auto', textAlign: 'center' }}>
            <video ref={videoRef} autoPlay muted width="640" height="480" />
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
        </div>
    );
};

export default FaceDetection;
