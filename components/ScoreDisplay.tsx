
import React from 'react';
import { MAX_SCORE } from '../constants';

interface ScoreDisplayProps {
  score: number;
  lastScoreChange: number | null;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, lastScoreChange }) => {
  const isChallengeZone = score >= 90;
  const scorePercentage = (score / MAX_SCORE) * 100;

  return (
    <div className="w-full bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-2 text-slate-300">
        <span className="font-bold text-lg">Score</span>
        <div className="flex items-center">
            {isChallengeZone && (
                 <span className="text-xs font-bold uppercase bg-purple-600 text-white py-1 px-2 rounded-full mr-3 animate-pulse">
                    CHALLENGE ZONE
                 </span>
            )}
            <span className="font-bold text-2xl text-white">{score}</span>
            <span className="text-slate-400">/{MAX_SCORE}</span>
            {lastScoreChange !== null && (
                 <span key={Date.now()} className={`ml-3 font-bold text-lg ${lastScoreChange > 0 ? 'text-green-400' : 'text-red-400'} animate-ping-once`}>
                    {lastScoreChange > 0 ? `+${lastScoreChange}` : lastScoreChange}
                 </span>
            )}
        </div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${scorePercentage}%` }}
        ></div>
      </div>
       <style>{`
        @keyframes ping-once {
            0% { transform: scale(1.5); opacity: 1; }
            100% { transform: scale(1); opacity: 0; }
        }
        .animate-ping-once {
            animation: ping-once 0.7s forwards;
        }
      `}</style>
    </div>
  );
};

export default ScoreDisplay;
