import React, { useRef, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Load facemesh model
  const runFacemesh = async () => {
    const net = await facemesh.load(); // Load the model
    console.log("Facemesh model loaded");
    setInterval(() => {
      detect(net);
    }, 100); // Run detection every 100 ms
  };

  // Detect faces
  const detect = async (net) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 // Video is ready
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video width and height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas dimensions
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Perform detection
      const faces = await net.estimateFaces(video);
      console.log(faces);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => drawMesh(faces, ctx));
    }
  };

  useEffect(() => {
    runFacemesh(); // Run facemesh on component mount
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
