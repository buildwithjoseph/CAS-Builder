import React, { useState, useEffect } from 'react';
import { Hero } from './Hero';
import { Quiz } from './Quiz';
import { Results } from './Results';
import { UserAnswers } from './types';

type View = 'hero' | 'quiz' | 'results';

interface AppState {
  view: View;
  answers: UserAnswers;
  quizStage: 1 | 'transition' | 2;
  quizStep: number;
}

const STORAGE_KEY = 'cas_builder_state_v1';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState<View>('hero');
  const [answers, setAnswers] = useState<UserAnswers>({});
  
  // Quiz progress state
  const [quizStage, setQuizStage] = useState<1 | 'transition' | 2>(1);
  const [quizStep, setQuizStep] = useState(0);

  // Restore state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        setView(parsed.view);
        setAnswers(parsed.answers);
        setQuizStage(parsed.quizStage || 1);
        setQuizStep(parsed.quizStep || 0);
      } catch (e) {
        console.error("Failed to parse saved state", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state on changes
  useEffect(() => {
    if (!isLoaded) return;
    
    const stateToSave: AppState = {
      view,
      answers,
      quizStage,
      quizStep
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [view, answers, quizStage, quizStep, isLoaded]);

  const handleStart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('quiz');
  };

  const handleQuizProgress = (newAnswers: UserAnswers, stage: 1 | 'transition' | 2, step: number) => {
    setAnswers(newAnswers);
    setQuizStage(stage);
    setQuizStep(step);
  };

  const handleQuizComplete = (finalAnswers: UserAnswers) => {
    setAnswers(finalAnswers);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('results');
  };

  const handleBackToHero = () => {
    setView('hero');
  };

  const handleRestart = () => {
    // Clear storage and reset state
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setQuizStage(1);
    setQuizStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('hero');
  };

  if (!isLoaded) return null; // Prevent flash of default content

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen selection:bg-blue-100 selection:text-blue-900">
      {view === 'hero' && <Hero onStart={handleStart} />}
      {view === 'quiz' && (
        <Quiz 
          initialAnswers={answers}
          initialStage={quizStage}
          initialStep={quizStep}
          onProgress={handleQuizProgress}
          onComplete={handleQuizComplete} 
          onBack={handleBackToHero} 
        />
      )}
      {view === 'results' && <Results answers={answers} onRestart={handleRestart} />}
    </div>
  );
};

export default App;