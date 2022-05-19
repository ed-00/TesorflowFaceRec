import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./meshUtilities.js";

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 500;

function App() {
  const webcamRef = useRef();
  const canvasRef = useRef();

  const detectFace = async (network) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.width = videoWidth;
      webcamRef.current.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const faceEstimate = await network.estimateFaces(video);

      const ctx = canvasRef.current.getContext("2d");
      drawMesh(faceEstimate, ctx);
    }
  };

  const loadFaceMesh = async () => {
    const network = await facemesh.load({
      inputResolutkion: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        scale: 0.8,
      },
    });
    setInterval(() => {
      detectFace(network);
    }, 100);
  };
  loadFaceMesh();
  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: "10rem",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          top: "10rem",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
      />
    </div>
  );
}

export default App;
