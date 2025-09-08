import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  RefreshCw
} from "lucide-react";

interface AnalysisResultsProps {
  onRetakeAnalysis?: () => void;
  results?: {
    blinkRate: number;
    riskLevel: string;
    completeBlinks: number;
    incompleteBlinks: number;
  };
}

const AnalysisResults = ({ onRetakeAnalysis, results }: AnalysisResultsProps) => {
  // Default mock data if no results provided
  const analysisData = results || {
    blinkRate: 15,
    riskLevel: "normal",
    completeBlinks: 12,
    incompleteBlinks: 3
  };

  const getRiskInfo = (riskLevel: string, blinkRate: number) => {
    switch (riskLevel) {
      case "high-risk":
        return {
          label: "High Risk",
          description: "Risk of Dry Eye",
          variant: "destructive" as const,
          icon: AlertTriangle,
          color: "text-destructive",
          score: Math.max(30, 60 - blinkRate * 2)
        };
      case "stress":
        return {
          label: "Elevated",
          description: "Possible Stress/Depression",
          variant: "warning" as const,
          icon: AlertTriangle,
          color: "text-warning",
          score: Math.min(70, 40 + blinkRate)
        };
      default:
        return {
          label: "Normal",
          description: "Healthy Eye Function",
          variant: "success" as const,
          icon: CheckCircle,
          color: "text-success",
          score: Math.min(95, 70 + blinkRate)
        };
    }
  };

  const riskInfo = getRiskInfo(analysisData.riskLevel, analysisData.blinkRate);
  const totalBlinks = analysisData.completeBlinks + analysisData.incompleteBlinks;
  const incompletePercentage = totalBlinks > 0 ? Math.round((analysisData.incompleteBlinks / totalBlinks) * 100) : 0;
  
  const getRecommendations = (riskLevel: string, blinkRate: number) => {
    if (riskLevel === "high-risk") {
      return [
        `Your blink rate of ${blinkRate}/min is below normal (12-15/min)`,
        "Consider using artificial tears or eye drops",
        "Take more frequent breaks from screen time (20-20-20 rule)",
        "Increase environmental humidity",
        "Consult an eye care professional if symptoms persist"
      ];
    } else if (riskLevel === "stress") {
      return [
        `Your blink rate of ${blinkRate}/min is elevated, possibly indicating stress`,
        "Practice stress management techniques",
        "Consider meditation or relaxation exercises",
        "Ensure adequate sleep (7-8 hours nightly)",
        "Consult a healthcare provider if stress symptoms persist"
      ];
    } else {
      return [
        `Your blink rate of ${blinkRate}/min is within normal range`,
        "Continue current eye care habits",
        "Maintain good screen hygiene with regular breaks",
        "Keep your environment adequately humidified"
      ];
    }
  };

  const recommendations = getRecommendations(analysisData.riskLevel, analysisData.blinkRate);
  const RiskIcon = riskInfo.icon;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Overall Result */}
      <Card className="medical-card p-8 text-center">
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full ${riskInfo.color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
            <RiskIcon className={`h-8 w-8 ${riskInfo.color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Complete</h2>
            <Badge variant={riskInfo.variant} className="text-sm px-3 py-1">
              {riskInfo.label} - {riskInfo.description}
            </Badge>
          </div>
          <div className="text-4xl font-bold text-primary">
            {riskInfo.score}/100
          </div>
          <p className="text-muted-foreground">Overall Eye Health Score</p>
        </div>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="medical-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Blink Rate</h3>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-foreground">{analysisData.blinkRate}/min</div>
            <div className="text-sm text-muted-foreground">Normal: 12-15/min</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${analysisData.blinkRate < 10 ? 'bg-destructive' : analysisData.blinkRate >= 18 ? 'bg-warning' : 'bg-success'}`}
                style={{ width: `${Math.min((analysisData.blinkRate / 25) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="medical-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Incomplete Blinks</h3>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-foreground">{incompletePercentage}%</div>
            <div className="text-sm text-muted-foreground">Normal: &lt;10%</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${incompletePercentage > 15 ? 'bg-destructive' : incompletePercentage > 10 ? 'bg-warning' : 'bg-success'}`}
                style={{ width: `${Math.min((incompletePercentage / 30) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="medical-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Complete Blinks</h3>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-foreground">{analysisData.completeBlinks}</div>
            <div className="text-sm text-muted-foreground">Total detected: {totalBlinks}</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${Math.min((analysisData.completeBlinks / Math.max(totalBlinks, 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="medical-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onRetakeAnalysis}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retake Analysis
        </Button>
        <Button variant="medical">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;