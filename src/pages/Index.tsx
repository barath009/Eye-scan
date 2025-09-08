import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import CameraInterface from "@/components/CameraInterface";
import AnalysisResults from "@/components/AnalysisResults";

type AppState = "hero" | "camera" | "results";

interface AnalysisData {
  blinkRate: number;
  riskLevel: string;
  completeBlinks: number;
  incompleteBlinks: number;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("hero");
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);

  const handleStartAnalysis = () => {
    setCurrentState("camera");
  };

  const handleAnalysisComplete = (results: AnalysisData) => {
    setAnalysisResults(results);
    setCurrentState("results");
  };

  const handleRetakeAnalysis = () => {
    setAnalysisResults(null);
    setCurrentState("camera");
  };

  const handleBackToHome = () => {
    setAnalysisResults(null);
    setCurrentState("hero");
  };

  return (
    <div className="min-h-screen bg-background">
      {currentState === "hero" && (
        <HeroSection onStartAnalysis={handleStartAnalysis} />
      )}
      
      {currentState === "camera" && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Eye Analysis</h1>
            <p className="text-muted-foreground">
              Follow the instructions below to complete your 1-minute dry eye assessment
            </p>
          </div>
          <CameraInterface onAnalysisComplete={handleAnalysisComplete} />
        </div>
      )}
      
      {currentState === "results" && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Results</h1>
            <p className="text-muted-foreground">
              Based on your 1-minute eye analysis
            </p>
          </div>
          <AnalysisResults 
            onRetakeAnalysis={handleRetakeAnalysis} 
            results={analysisResults || undefined}
          />
          
          <div className="mt-8 text-center">
            <button 
              onClick={handleBackToHome}
              className="text-primary hover:underline"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
