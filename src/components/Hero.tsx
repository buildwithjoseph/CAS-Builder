import React from 'react';
import { Button } from './ui/Button';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-blue-50/30">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in-up">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mx-auto">
          <Layers className="w-4 h-4" />
          <span>System First, Tools Second</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
          Stop Guessing Your <br />
          <span className="text-blue-600">Client Acquisition Stack</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Most businesses buy software before they have a blueprint. 
          Use this free tool to design your ideal acquisition system based on your sales model—agnostic of any specific brand.
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left py-8">
          {[
            "Identify critical bottlenecks",
            "Calculate true software costs",
            "Get a custom system blueprint"
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-white/60 border border-slate-100 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={onStart} size="lg" className="group">
            Build My System
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-slate-500 mt-4 sm:mt-0">
            Takes 60 seconds • No email required
          </p>
        </div>
      </div>
    </div>
  );
};