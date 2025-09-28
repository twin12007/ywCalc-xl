
import React from 'react';
import MathRenderer from './MathRenderer';

interface QuestionCardProps {
  questionText: string;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionText,
  userAnswer,
  setUserAnswer,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <div className="w-full bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-sm font-semibold text-cyan-400 uppercase mb-4">Problem</h2>
      <div className="text-slate-200 text-xl mb-6 min-h-[5rem]">
         <MathRenderer content={questionText} />
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="answer" className="block text-sm font-medium text-slate-400 mb-2">
          Your Answer
        </label>
        <input
          id="answer"
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          autoComplete="off"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || userAnswer.trim() === ''}
          className="mt-4 w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </button>
      </form>
    </div>
  );
};

export default QuestionCard;
