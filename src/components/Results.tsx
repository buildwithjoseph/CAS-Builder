import React, { useMemo, useState } from 'react';
import { UserAnswers, SystemBlueprint } from '../types';
import { generateBlueprint, GHL_COMPARISON } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  RefreshCw, 
  CheckCircle2,
  XCircle,
  TrendingDown,
  GitBranch,
  Lightbulb,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResultsProps {
  answers: UserAnswers;
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ answers, onRestart }) => {
  const blueprint: SystemBlueprint = useMemo(() => generateBlueprint(answers), [answers]);
  const [showGHL, setShowGHL] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Calculate costs based on the filtered Required Tools (which are subset of Market Data)
  const monthlyCost = blueprint.requiredTools.reduce((acc, tool) => acc + tool.avgCost, 0);
  const toolCount = blueprint.requiredTools.length;

  const costData = [
    { name: 'Separate Tools', cost: monthlyCost, color: '#64748b' },
    { name: 'Consolidated', cost: GHL_COMPARISON.price, color: '#2563eb' },
  ];

  const handleExportPDF = async () => {
    setIsExporting(true);
    const element = document.getElementById('blueprint-content');
    if (!element) return;

    // Temporary style adjustments for PDF capture
    const originalBackground = element.style.background;
    element.style.background = '#ffffff';

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate height relative to PDF width to handle scrolling content
      const imgComponentWidth = pdfWidth;
      const imgComponentHeight = (canvas.height * pdfWidth) / canvas.width;

      // Better approach for long web content:
      if (imgComponentHeight > pdfHeight) {
         // It's long. Let's just create a custom size PDF to fit the whole image
         const longPdf = new jsPDF('p', 'mm', [pdfWidth, imgComponentHeight]);
         longPdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgComponentHeight);
         longPdf.save('my-custom-system.pdf');
      } else {
         pdf.addImage(imgData, 'PNG', 0, 0, imgComponentWidth, imgComponentHeight);
         pdf.save('my-custom-system.pdf');
      }

    } catch (error) {
      console.error('Export failed', error);
      alert('Could not generate PDF. Please try again.');
    } finally {
      element.style.background = originalBackground;
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900 text-white pt-12 pb-32 px-6 no-print">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <p className="text-blue-400 font-medium mb-2 uppercase tracking-wider text-sm">System Architect</p>
              <h1 className="text-3xl md:text-5xl font-bold">Your Custom Growth Blueprint</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportPDF} disabled={isExporting} className="bg-blue-600 hover:bg-blue-500">
                {isExporting ? 'Generating...' : 'Export PDF'}
                <Download className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="sm" onClick={onRestart} className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>
          <p className="text-slate-300 max-w-2xl text-lg">{blueprint.description}</p>
        </div>
      </div>

      {/* Main Content Area (Target for PDF Export) */}
      <div id="blueprint-content" className="max-w-5xl mx-auto px-6 -mt-20 space-y-16 pb-12 bg-slate-50 pt-6 rounded-t-xl">
        
        {/* Section 1: The Behavioral System Flow */}
        <section>
          <Card className="shadow-2xl shadow-slate-900/10 border-slate-200 print:shadow-none">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-blue-600" />
                Your Adapted System Flow
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Logic modules selected based on your specific lead behavior and constraints.
              </p>
            </div>
            
            <div className="space-y-0 relative">
              {/* Connecting Line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-slate-200 -z-10" />

              {blueprint.steps.map((step, idx) => (
                <div key={step.id} className="relative flex gap-6 pb-8 last:pb-0 break-inside-avoid">
                  {/* Number Bubble */}
                  <div className="shrink-0 w-14 h-14 rounded-full bg-white border-4 border-slate-50 shadow-sm flex items-center justify-center font-bold text-slate-700 z-10">
                    {idx + 1}
                  </div>

                  {/* Content Block */}
                  <div className="flex-grow bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide
                          ${step.type === 'intake' ? 'bg-purple-100 text-purple-700' : ''}
                          ${step.type === 'action' ? 'bg-orange-100 text-orange-700' : ''}
                          ${step.type === 'nurture' ? 'bg-blue-100 text-blue-700' : ''}
                          ${step.type === 'conversion' ? 'bg-green-100 text-green-700' : ''}
                          ${step.type === 'retention' ? 'bg-pink-100 text-pink-700' : ''}
                        `}>
                          {step.type}
                        </span>
                        <h3 className="font-bold text-slate-900">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 mb-3">{step.description}</p>
                    
                    {/* The "Why" Logic Block */}
                    <div className="flex items-start gap-2 text-sm bg-white p-3 rounded border border-slate-100 text-slate-500">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span><span className="font-medium text-slate-700">Why this block?</span> {step.reason}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 2: Required Tech Stack (Market Context) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 break-inside-avoid">
          
          {/* List of tools */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Required Tech Stack</h3>
              <p className="text-slate-600">To execute the logic above, you need these specific software capabilities. Here are the market standards:</p>
            </div>

            <div className="space-y-4">
              {blueprint.requiredTools.map((tool, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-2 text-slate-900 font-semibold">
                       <Database className="w-4 h-4 text-blue-500" />
                       {tool.category}
                     </div>
                     <div className="text-right">
                       <span className="block font-bold text-slate-900">~${tool.avgCost}</span>
                       <span className="text-xs text-slate-500">/mo</span>
                     </div>
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Function:</span> {tool.description}
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                    <span className="font-semibold">Examples:</span> {tool.examples}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Cost Reality */}
            <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 mt-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-600 font-medium">Estimated Monthly Cost</span>
                <span className="text-3xl font-bold text-slate-900">${monthlyCost}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-500 text-sm">Tools to Manage</span>
                <span className="font-semibold text-slate-900">{toolCount} Separate Logins</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex gap-2 items-start text-sm text-amber-700 bg-amber-50 p-3 rounded-md">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Warning: This doesn't include integration costs (Zapier) or the mental overhead of syncing data.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pitfalls & Mistakes */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Common Pitfalls</h3>
            <Card>
              <ul className="space-y-4">
                {blueprint.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{mistake}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t border-slate-100 print:hidden">
                <h4 className="font-semibold text-slate-900 mb-4">The "Frankenstein" Problem</h4>
                <p className="text-slate-600 text-sm mb-4">
                  Instead of managing all these tools separately, some businesses choose a consolidated platform that includes all of these capabilities in one place.
                </p>
                {!showGHL ? (
                  <Button 
                    fullWidth 
                    size="lg"
                    onClick={() => setShowGHL(true)}
                    className="animate-pulse shadow-blue-200 shadow-lg"
                  >
                    Reveal Consolidated Option
                  </Button>
                ) : (
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center font-medium border border-green-100">
                    Analysis revealed below ↓
                  </div>
                )}
              </div>
            </Card>
          </div>
        </section>

        {/* Section 3: The Consolidation (GHL) */}
        {showGHL && (
          <section className="animate-fade-in-up pb-12 break-inside-avoid">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 transform -skew-y-1 rounded-3xl -z-10 opacity-5" />
              <Card className="border-blue-200 shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-4 text-white text-center text-sm font-medium">
                  Recommendation based on your need for {answers.priority === 'simplicity' ? 'simplicity' : 'consolidation'}
                </div>
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Chart side */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">The Consolidation Advantage</h3>
                    <p className="text-slate-600 mb-8">
                      You get the entire stack—CRM, Funnels, Email, SMS, and Scheduling—for a single flat monthly price.
                    </p>
                    
                    <div className="h-64 w-full mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12, fill: '#64748b'}} />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={40}>
                            {costData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-800">
                        <TrendingDown className="w-5 h-5" />
                        <span className="font-bold">Monthly Savings</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-700">${Math.max(0, monthlyCost - GHL_COMPARISON.price)}</span>
                    </div>
                  </div>

                  {/* Feature side */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        {GHL_COMPARISON.name}
                      </h4>
                      <p className="text-slate-600 mb-6">
                        It replaces the {toolCount} tools listed above. No Zapier required. Data flows instantly between your forms, calendar, and emails.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {GHL_COMPARISON.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100 no-print">
                      <div className="flex flex-col gap-3">
                        <Button 
                          size="lg" 
                          fullWidth 
                          onClick={() => window.open('https://www.gohighlevel.com/?fp_ref=casbuilder', '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                        >
                          Start 14-Day Free Trial
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <p className="text-xs text-center text-slate-400">
                          30-day free trial available. Plans start at $97/mo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};