"use client";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, Eye } from "lucide-react";
import { FaceMesh } from "@mediapipe/face_mesh";
import AnalysisResults from "./AnalysisResults"; // ⬅️ Import results component

const CameraInterface = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Normal");
  const [cameraError, setCameraError] = useState("");
  const [results, setResults] = useState<any | null>(null);

  const [analysisTime] = useState(60);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const runningRef = useRef(false);

  const BLINK_THRESHOLD = 0.27;
  const BLINK_CONSEC_FRAMES = 2;
  let blinkFrameCounter = 0;

  const calculateEAR = (eye: any[]) => {
    const dist = (p1: any, p2: any) =>
      Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    const A = dist(eye[1], eye[5]);
    const B = dist(eye[2], eye[4]);
    const C = dist(eye[0], eye[3]);
    return (A + B) / (2.0 * C);
  };

  const classifyRisk = (blinkRate: number) => {
    if (blinkRate < 10) return "high-risk";
    if (blinkRate >= 12 && blinkRate <= 15) return "normal";
    if (blinkRate >= 18) return "stress";
    return "uncertain";
  };

  const startCamera = async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results: any) => {
        if (!runningRef.current) return;
        if (results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];

          const leftEyeIdx = [33, 160, 158, 133, 153, 144];
          const rightEyeIdx = [362, 385, 387, 263, 373, 380];

          const leftEye = leftEyeIdx.map((i) => landmarks[i]);
          const rightEye = rightEyeIdx.map((i) => landmarks[i]);

          const earLeft = calculateEAR(leftEye);
          const earRight = calculateEAR(rightEye);
          const ear = (earLeft + earRight) / 2.0;

          if (ear < BLINK_THRESHOLD) {
            blinkFrameCounter++;
          } else {
            if (blinkFrameCounter >= BLINK_CONSEC_FRAMES) {
              setBlinkCount((prev) => prev + 1);
            }
            blinkFrameCounter = 0;
          }
        }
      });

      const sendFrame = async () => {
        if (!runningRef.current) return;
        if (videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
        requestAnimationFrame(sendFrame);
      };

      runningRef.current = true;
      sendFrame();
    } catch (err: any) {
      console.error("Camera error:", err);
      if (err.name === "NotAllowedError")
        setCameraError("Camera access denied.");
      else if (err.name === "NotFoundError")
        setCameraError("No camera found.");
      else setCameraError("Unable to access camera.");
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setBlinkCount(0);
    setCurrentTime(0);
    setResults(null); // reset previous results
    startCamera();

    intervalRef.current = setInterval(() => {
      setCurrentTime((t) => {
        const newTime = t + 1;
        const blinkRate = blinkCount / (newTime / 60);
        setRiskLevel(classifyRisk(blinkRate));
        if (newTime >= analysisTime) stopAnalysis();
        return newTime;
      });
    }, 1000);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    runningRef.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    // Save results
    const blinkRate = blinkCount / (currentTime / 60 || 1);
    setResults({
      blinkRate: parseFloat(blinkRate.toFixed(1)),
      riskLevel,
      completeBlinks: blinkCount,
      incompleteBlinks: 0, // placeholder
    });
  };

  const handleRetake = () => {
    setResults(null);
    startAnalysis();
  };

  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <Card className="p-4 max-w-2xl mx-auto">
      {results ? (
        <AnalysisResults results={results} onRetakeAnalysis={handleRetake} />
      ) : (
        <>
          {/* Start / Stop Buttons */}
          <div className="flex justify-between mb-4">
            <Button onClick={startAnalysis} disabled={isAnalyzing}>
              <Play size={16} /> Start
            </Button>
            <Button onClick={stopAnalysis} disabled={!isAnalyzing}>
              <Square size={16} /> Stop
            </Button>
          </div>

          {/* Camera */}
          {cameraError ? (
            <p className="text-red-500">{cameraError}</p>
          ) : (
            <video
              ref={videoRef}
              className="w-full rounded-lg bg-black"
              autoPlay
              muted
              playsInline
            />
          )}

          {/* Stats */}
          <div className="mt-4 space-y-2">
            <p>
              <Eye className="inline mr-2" size={16} /> Blinks:{" "}
              <strong>{blinkCount}</strong>
            </p>
            <p>
              Time: <strong>{currentTime}s</strong> / {analysisTime}s
            </p>
            <p>
              Blink Rate:{" "}
              <strong>
                {(blinkCount / (currentTime / 60 || 1)).toFixed(1)}
              </strong>{" "}
              blinks/min
            </p>
            <p>
              Risk Level: <strong>{riskLevel}</strong>
            </p>
          </div>

          {/* Instructions & Assessment */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50">
            <h2 className="text-lg font-semibold mb-4">Analysis Instructions</h2>
            <div className="flex justify-around text-center mb-6">
              <div>
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-2 font-bold text-blue-600">
                  1
                </div>
                <p>Position your face 18-24 inches from the camera</p>
              </div>
              <div>
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-2 font-bold text-blue-600">
                  2
                </div>
                <p>Look directly at the camera with good lighting</p>
              </div>
              <div>
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-2 font-bold text-blue-600">
                  3
                </div>
                <p>Blink naturally during the 1-minute analysis</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">Blink Rate Assessment</h2>
            <div className="flex justify-around bg-blue-100 rounded-lg p-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
                <p className="text-red-600 font-semibold">&lt;10/min</p>
                <p>High Risk</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                <p className="text-green-600 font-semibold">12–15/min</p>
                <p>Normal</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                <p className="text-yellow-600 font-semibold">&ge;18/min</p>
                <p>Stress/Depression</p>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default CameraInterface;
