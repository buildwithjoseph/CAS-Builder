import React, { useState, useEffect } from 'react';
import { STAGE_1_QUESTIONS, STAGE_2_QUESTIONS } from '../constants';
import { UserAnswers } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { ArrowLeft, ArrowRight, Settings2, Sparkles } from 'lucide-react';

interface QuizProps {
  initialAnswers: UserAnswers;
  initialStage: 1 | 'transition' | 2;
  initialStep: number;
  onProgress: (answers: UserAnswers, stage: 1 | 'transition' | 2, step: number) => void;
  onComplete: (answers: UserAnswers) => void;
  onBack: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ 
  initialAnswers, 
  initialStage, 
  initialStep, 
  onProgress,
  onComplete, 
  onBack 
}) => {
  const [stage, setStage] = useState<1 | 'transition' | 2>(initialStage);
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);

  // Determine current question based on stage
  const currentQuestions = stage === 1 ? STAGE_1_QUESTIONS : STAGE_2_QUESTIONS;
  const question = stage === 'transition' ? null : currentQuestions[currentStepIndex];

  // Calculate overall progress
  const totalQuestions = STAGE_1_QUESTIONS.length + STAGE_2_QUESTIONS.length;
  const globalIndex = stage === 1 ? currentStepIndex : (stage === 'transition' ? STAGE_1_QUESTIONS.length : STAGE_1_QUESTIONS.length + currentStepIndex);
  const progress = ((globalIndex + 1) / totalQuestions) * 100;

  // Report progress changes to parent
  useEffect(() => {
    onProgress(answers, stage, currentStepIndex);
  }, [answers, stage, currentStepIndex]);

  const handleOptionSelect = (value: string) => {
    if (!question) return;
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (stage === 1) {
      if (currentStepIndex < STAGE_1_QUESTIONS.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setStage('transition');
      }
    } else if (stage === 2) {
      if (currentStepIndex < STAGE_2_QUESTIONS.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        onComplete(answers);
      }
    }
  };

  const handlePrevious = () => {
    if (stage === 1) {
      if (currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
      } else {
        onBack();
      }
    } else if (stage === 2) {
      if (currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
      } else {
        setStage('transition');
      }
    } else if (stage === 'transition') {
       // Go back to last step of Stage 1
       setStage(1);
       setCurrentStepIndex(STAGE_1_QUESTIONS.length - 1);
    }
  };

  const startStage2 = () => {
    setStage(2);
    setCurrentStepIndex(0);
  };

  // --- TRANSITION VIEW ---
  if (stage === 'transition') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white animate-fade-in">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25"></div>
            <div className="relative bg-blue-600 rounded-full w-full h-full flex items-center justify-center">
              <Settings2 className="w-10 h-10 text-white animate-spin-slow" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-4">Phase 1 Complete</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              We have your foundation structure. <br/>
              <span className="text-white font-medium">Now let’s adapt this system based on how your leads actually behave.</span>
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={startStage2} 
              size="lg" 
              className="w-full !bg-white !text-slate-900 hover:!bg-slate-100"
            >
              Customize Logic
              <Sparkles className="w-4 h-4 ml-2 text-blue-600" />
            </Button>
            
            <button 
              onClick={handlePrevious}
              className="text-slate-400 hover:text-white text-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTION VIEW ---
  if (!question) return null; // Should not happen

  const canProceed = !!answers[question.id];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Progress Header */}
        <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-2">
          <span>
            {stage === 1 ? 'Foundation' : 'Behavioral Logic'} • Question {currentStepIndex + 1} of {currentQuestions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${stage === 2 ? 'bg-indigo-600' : 'bg-blue-600'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <Card className="min-h-[400px] flex flex-col animate-fade-in-up">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{question.title}</h2>
            {question.subtitle && (
              <p className="text-slate-600">{question.subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
            {question.options.map((option) => {
              const Icon = option.icon;
              const isSelected = answers[question.id] === option.value;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`
                    relative p-4 rounded-lg border-2 text-left transition-all
                    hover:border-blue-300 hover:bg-blue-50/50
                    ${isSelected 
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                      : 'border-slate-200 bg-white'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    {Icon && (
                      <div className={`
                        p-2 rounded-lg shrink-0
                        ${isSelected ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className={`font-semibold mb-1 ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-slate-500 leading-snug">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Radio indicator */}
                  <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : ''}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            <Button variant="ghost" onClick={handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!canProceed}
              variant={stage === 2 ? 'secondary' : 'primary'}
            >
              {stage === 2 && currentStepIndex === STAGE_2_QUESTIONS.length - 1 ? 'Generate System' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};