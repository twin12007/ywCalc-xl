
import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus, Difficulty, Question } from './types';
import { CALCULUS_TOPICS, MAX_SCORE } from './constants';
import { generateCalculusProblem } from './services/geminiService';
import ScoreDisplay from './components/ScoreDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import QuestionCard from './components/QuestionCard';
import FeedbackPanel from './components/FeedbackPanel';

const App: React.FC = () => {
    const [score, setScore] = useState<number>(0);
    const [lastScoreChange, setLastScoreChange] = useState<number | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [gameStatus, setGameStatus] = useState<GameStatus>('LOADING');
    // Fix: Add state to handle answer submission UI
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [challengeZoneTriesLeft, setChallengeZoneTriesLeft] = useState<number>(2);

    const getDifficulty = useCallback((currentScore: number): Difficulty => {
        if (currentScore >= 90) return Difficulty.CHALLENGE;
        if (currentScore >= 65) return Difficulty.HARD;
        if (currentScore >= 30) return Difficulty.MEDIUM;
        return Difficulty.EASY;
    }, []);

    const fetchNewQuestion = useCallback(async (currentScore: number) => {
        setGameStatus('LOADING');
        setIsSubmitting(false); // Reset submission state for new question
        const difficulty = getDifficulty(currentScore);
        const topic = CALCULUS_TOPICS[Math.floor(Math.random() * CALCULUS_TOPICS.length)];
        const question = await generateCalculusProblem(topic, difficulty);
        
        if (question) {
            setCurrentQuestion(question);
            setGameStatus('PLAYING');
        } else {
            setGameStatus('ERROR');
        }
        setUserAnswer('');
        setChallengeZoneTriesLeft(2);
    }, [getDifficulty]);

    useEffect(() => {
        fetchNewQuestion(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const calculateScoreUpdate = (isCorrect: boolean, currentScore: number): number => {
        if (currentScore >= 90) { // Challenge Zone
            return isCorrect ? 1 : -10;
        }

        const scoreFactor = currentScore / 90.0; // 0.0 to ~0.99
        
        if (isCorrect) {
            const maxGain = 15 - (scoreFactor * 10); // Range shifts from 15 down to 5
            const minGain = 5;
            const points = Math.round(Math.random() * (maxGain - minGain) + minGain);
            return points;
        } else {
            const minLoss = 3 + (scoreFactor * 9); // Range shifts from 3 up to 12
            const maxLoss = 12;
            const points = Math.round(Math.random() * (maxLoss - minLoss) + minLoss);
            return -points;
        }
    };

    const handleAnswerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentQuestion || isSubmitting) return;

        setIsSubmitting(true);

        // Artificial delay for UX to show "Checking..." state
        setTimeout(() => {
            const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
            
            if (score >= 90) { // Challenge Zone Logic
                if (isCorrect) {
                    const points = calculateScoreUpdate(true, score);
                    setLastScoreChange(points);
                    setScore(prev => Math.min(MAX_SCORE, prev + points));
                    setGameStatus('CORRECT');
                } else {
                    if (challengeZoneTriesLeft > 1) {
                        setChallengeZoneTriesLeft(1);
                        setGameStatus('INCORRECT_FIRST_TRY');
                    } else {
                        const points = calculateScoreUpdate(false, score);
                        setLastScoreChange(points);
                        setScore(prev => Math.max(0, prev + points));
                        setGameStatus('INCORRECT_FINAL');
                    }
                }
            } else { // Normal Logic
                const points = calculateScoreUpdate(isCorrect, score);
                setLastScoreChange(points);
                setScore(prev => Math.min(MAX_SCORE, Math.max(0, prev + points)));
                setGameStatus(isCorrect ? 'CORRECT' : 'INCORRECT_FINAL');
            }
        }, 500);
    };

    useEffect(() => {
        if (score >= MAX_SCORE) {
            setGameStatus('WON');
        }
    }, [score]);


    const handleNextQuestion = () => {
        if(gameStatus === 'INCORRECT_FIRST_TRY') {
             setGameStatus('PLAYING');
             setUserAnswer('');
        } else {
            fetchNewQuestion(score);
        }
    };
    
    const restartGame = () => {
        setScore(0);
        setLastScoreChange(null);
        fetchNewQuestion(0);
    }

    const renderContent = () => {
        switch (gameStatus) {
            case 'LOADING':
                return <LoadingSpinner />;
            case 'PLAYING':
                return currentQuestion && (
                    <QuestionCard 
                        questionText={currentQuestion.question}
                        userAnswer={userAnswer}
                        setUserAnswer={setUserAnswer}
                        handleSubmit={handleAnswerSubmit}
                        // Fix: Pass the correct submitting state to enable "Checking..." UI feedback
                        isSubmitting={isSubmitting}
                    />
                );
            case 'CORRECT':
            case 'INCORRECT_FIRST_TRY':
            case 'INCORRECT_FINAL':
                return currentQuestion && (
                    <FeedbackPanel 
                        status={gameStatus}
                        question={currentQuestion}
                        handleNextQuestion={handleNextQuestion}
                    />
                );
            case 'WON':
                return (
                    <div className="text-center bg-slate-800 p-8 rounded-xl shadow-lg border border-cyan-500">
                        <h2 className="text-4xl font-bold text-green-400 mb-4">Congratulations!</h2>
                        <p className="text-slate-300 text-lg mb-6">You've mastered the calculus challenge!</p>
                        <button onClick={restartGame} className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-500 transition-colors">
                            Play Again
                        </button>
                    </div>
                );
            case 'ERROR':
                 return (
                    <div className="text-center bg-slate-800 p-8 rounded-xl shadow-lg border border-red-500">
                        <h2 className="text-2xl font-bold text-red-400 mb-4">An Error Occurred</h2>
                        <p className="text-slate-300 mb-6">Could not fetch a new problem. Please check your connection and API key.</p>
                        <button onClick={() => fetchNewQuestion(score)} className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-500 transition-colors">
                            Try Again
                        </button>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
            <div className="w-full max-w-2xl mx-auto space-y-6">
                <header className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 pb-2">
                        Calculus Quest
                    </h1>
                    <p className="text-slate-400">An adaptive challenge to master calculus.</p>
                </header>

                <main>
                    <ScoreDisplay score={score} lastScoreChange={lastScoreChange} />
                    <div className="mt-6">
                        {renderContent()}
                    </div>
                </main>
                
                <footer className="text-center text-slate-500 text-sm">
                    <p>Powered by Gemini. Questions are AI-generated and may occasionally contain errors.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
