import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Clock, Award, CheckCircle, XCircle,
    ChevronRight, Lightbulb, RotateCcw, Loader2
} from 'lucide-react';
import { dbService } from '../lib/supabase';

interface Question {
    id: string;
    title: string;
    content: string;
    options: { id: string; text: string }[];
    correct_answer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    grade_id: string;
    points: number;
    time_limit: number;
    image_url?: string;
}

const QuestionDetail: React.FC = () => {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();

    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [timerActive, setTimerActive] = useState(true);

    useEffect(() => {
        if (questionId) {
            loadQuestion(questionId);
        }
    }, [questionId]);

    useEffect(() => {
        if (question && timerActive && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && timerActive && question) {
            handleSubmit();
        }
    }, [timeLeft, timerActive, question]);

    const loadQuestion = async (id: string) => {
        setLoading(true);
        try {
            const data = await dbService.getQuestionById(id);
            if (data) {
                setQuestion(data as Question);
                setTimeLeft(data.time_limit || 60);
            }
        } catch (error) {
            console.error('Error loading question:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setShowResult(true);
        setTimerActive(false);

        // Track progress
        if (question && selectedAnswer) {
            dbService.trackQuestionProgress({
                question_id: question.id,
                user_answer: selectedAnswer,
                is_correct: selectedAnswer === question.correct_answer,
                time_spent: question.time_limit - timeLeft
            });
        }
    };

    const handleRetry = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(question?.time_limit || 60);
        setTimerActive(true);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'Kolay';
            case 'medium': return 'Orta';
            case 'hard': return 'Zor';
            default: return 'Bilinmiyor';
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-bio-coral" />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Soru Bulunamadı</h1>
                    <Link to="/sorular" className="text-bio-coral hover:underline">
                        Sorulara Dön
                    </Link>
                </div>
            </div>
        );
    }

    const isCorrect = selectedAnswer === question.correct_answer;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-4 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Geri
                    </button>

                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {getDifficultyLabel(question.difficulty)}
                        </span>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold ${timeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'
                            }`}>
                            <Clock size={18} />
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="max-w-4xl mx-auto px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                >
                    {/* Question Header */}
                    <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-bio-coral/5 to-bio-mint/5">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm text-slate-500 flex items-center gap-1">
                                <Award size={16} className="text-bio-coral" />
                                {question.points} puan
                            </span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-display">
                            {question.title}
                        </h1>
                    </div>

                    {/* Question Body */}
                    <div className="p-6">
                        <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                            {question.content}
                        </p>

                        {question.image_url && (
                            <div className="mb-6">
                                <img
                                    src={question.image_url}
                                    alt="Soru görseli"
                                    className="max-w-full rounded-xl border border-slate-200"
                                />
                            </div>
                        )}

                        {/* Options */}
                        <div className="space-y-3">
                            {question.options?.map((option) => {
                                let optionClass = 'border-slate-200 hover:border-bio-coral/50 hover:bg-bio-coral/5';

                                if (showResult) {
                                    if (option.id === question.correct_answer) {
                                        optionClass = 'border-green-500 bg-green-50';
                                    } else if (option.id === selectedAnswer && option.id !== question.correct_answer) {
                                        optionClass = 'border-red-500 bg-red-50';
                                    } else {
                                        optionClass = 'border-slate-200 opacity-50';
                                    }
                                } else if (selectedAnswer === option.id) {
                                    optionClass = 'border-bio-coral bg-bio-coral/10';
                                }

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => !showResult && setSelectedAnswer(option.id)}
                                        disabled={showResult}
                                        className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center gap-4 ${optionClass}`}
                                    >
                                        <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${showResult && option.id === question.correct_answer
                                                ? 'bg-green-500 text-white'
                                                : showResult && option.id === selectedAnswer
                                                    ? 'bg-red-500 text-white'
                                                    : selectedAnswer === option.id
                                                        ? 'bg-bio-coral text-white'
                                                        : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {option.id}
                                        </span>
                                        <span className="flex-1 font-medium text-slate-700">{option.text}</span>
                                        {showResult && option.id === question.correct_answer && (
                                            <CheckCircle className="text-green-500" size={24} />
                                        )}
                                        {showResult && option.id === selectedAnswer && option.id !== question.correct_answer && (
                                            <XCircle className="text-red-500" size={24} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Result */}
                        {showResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-6 p-6 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    {isCorrect ? (
                                        <>
                                            <CheckCircle className="text-green-500" size={24} />
                                            <span className="font-bold text-green-700">Doğru Cevap! 🎉</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="text-red-500" size={24} />
                                            <span className="font-bold text-red-700">Yanlış Cevap</span>
                                        </>
                                    )}
                                </div>

                                {question.explanation && (
                                    <div className="mt-4 p-4 bg-white/50 rounded-lg">
                                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                                            <Lightbulb size={18} className="text-yellow-500" />
                                            <span className="font-medium">Açıklama</span>
                                        </div>
                                        <p className="text-slate-700">{question.explanation}</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            {!showResult ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedAnswer}
                                    className="flex-1 py-4 bg-gradient-to-r from-bio-coral to-orange-400 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                                >
                                    Cevabı Kontrol Et
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleRetry}
                                        className="flex-1 py-4 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        <RotateCcw size={20} />
                                        Tekrar Dene
                                    </button>
                                    <Link
                                        to={`/sorular/cozum/${question.id}`}
                                        className="flex-1 py-4 flex items-center justify-center gap-2 bg-bio-mint text-white font-bold rounded-xl hover:bg-bio-mint-dark transition-colors"
                                    >
                                        Çözümü Gör
                                        <ChevronRight size={20} />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default QuestionDetail;
