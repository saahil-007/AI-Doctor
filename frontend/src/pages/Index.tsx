import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-16 relative z-10 flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-semibold tracking-wide uppercase">AI-Powered Healthcare</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-100 to-neutral-400 mb-8 leading-tight">
              AI Doctor
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-200 mb-10 max-w-xl leading-relaxed font-light">
              Experience the future of healthcare with our intelligent AI assistant. 
              Get instant medical insights, personalized health advice, and 24/7 support 
              powered by advanced artificial intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Button
                size="lg"
                onClick={() => navigate("/chat")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-neutral-600 text-cyan-400 hover:bg-neutral-800 hover:text-cyan-300 hover:border-neutral-500 font-semibold px-8 py-6 rounded-xl transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Right content - 3D Scene */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-0">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
