
import React from 'react';
import { GameStatus, Question } from '../types';
import { CheckIcon, XIcon } from './icons';
import MathRenderer from './MathRenderer';


interface FeedbackPanelProps {
  status: GameStatus;
  question: Question;
  handleNextQuestion: () => void;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ status, question, handleNextQuestion }) => {
  const isCorrect = status === 'CORRECT';
  const isFirstTryIncorrect = status === 'INCORRECT_FIRST_TRY';
  const isFinalIncorrect = status === 'INCORRECT_FINAL';

  const baseClasses = "w-full p-6 rounded-xl shadow-lg border";
  const colorClasses = isCorrect
    ? "bg-green-900/20 border-green-500"
    : "bg-red-900/20 border-red-500";

  let title = '';
  let titleColor = '';
  let IconComponent = CheckIcon;

  if (isCorrect) {
    title = 'Correct!';
    titleColor = 'text-green-400';
    IconComponent = CheckIcon;
  } else if (isFirstTryIncorrect) {
    title = 'Not quite. Try again!';
    titleColor = 'text-yellow-400';
    IconComponent = XIcon;
  } else {
    title = 'Incorrect';
    titleColor = 'text-red-400';
    IconComponent = XIcon;
  }

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <div className="flex items-center mb-4">
        <IconComponent className={`w-8 h-8 mr-3 ${titleColor}`} />
        <h2 className={`text-2xl font-bold ${titleColor}`}>{title}</h2>
      </div>

      {(isCorrect || isFinalIncorrect) && (
        <div className="space-y-4 text-slate-300">
           {!isCorrect && (
                <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Correct Answer:</p>
                    <MathRenderer content={`$${question.answer}$`} className="font-mono text-lg text-cyan-300" />
                </div>
            )}
          <div className="p-4 bg-slate-800 rounded-lg">
            <h3 className="text-sm font-semibold text-cyan-400 uppercase mb-2">Solution</h3>
            <div className="text-slate-200">
                <MathRenderer content={question.solution} />
            </div>
          </div>
        </div>
      )}

      {(isCorrect || isFinalIncorrect) ? (
        <button
            onClick={handleNextQuestion}
            className="mt-6 w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
        >
            Next Question
        </button>
      ) : (
         <button
            onClick={handleNextQuestion}
            className="mt-6 w-full bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-yellow-500 transition-colors"
        >
            Try Again
        </button>
      )}

    </div>
  );
};

export default FeedbackPanel;
