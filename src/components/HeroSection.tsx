import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Camera, Activity, Shield } from "lucide-react";
import heroImage from "@/assets/eye-analysis-hero.jpg";

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

const HeroSection = ({ onStartAnalysis }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                <span>FDA-Quality Analysis</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Detect Dry Eye 
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Risk</span> in 30 Seconds
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Advanced AI analyzes your blink patterns, eye redness, and movement to provide 
                instant dry eye risk assessment using just your camera.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                variant="medical" 
                size="lg" 
                onClick={onStartAnalysis}
                className="px-8 py-4 text-lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                Start Free Analysis
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Learn More
              </Button>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Blink Analysis</h3>
                <p className="text-sm text-muted-foreground">Rate & completeness tracking</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Redness Detection</h3>
                <p className="text-sm text-muted-foreground">AI-powered assessment</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Risk Report</h3>
                <p className="text-sm text-muted-foreground">Instant results & guidance</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <Card className="medical-card p-4 medical-shadow">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={heroImage} 
                  alt="Eye analysis technology demonstration" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                
                {/* Floating indicators */}
                <div className="absolute top-4 right-4">
                  <div className="bg-success/90 text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
                    ● Live Analysis
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Blink Rate</span>
                      <span className="font-semibold text-foreground">16/min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Risk Level</span>
                      <span className="font-semibold text-success">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;