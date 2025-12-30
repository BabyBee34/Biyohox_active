
import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
}

const QuizComponent: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
          <Trophy size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Tamamlandı!</h3>
        <p className="text-gray-600 mb-6">
          Toplam Skor: <span className="font-bold text-bio-mint-dark text-xl">{score} / {questions.length}</span>
        </p>
        <button
          onClick={resetQuiz}
          className="inline-flex items-center gap-2 px-6 py-2 bg-bio-mint text-white font-bold rounded-lg hover:bg-bio-mint-dark transition-colors shadow-lg shadow-bio-mint/20"
        >
          <RefreshCw size={18} /> Tekrar Çöz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Bölüm Testi</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Soru {currentQuestionIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-lg text-gray-800 font-medium mb-4">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let optionClass = "w-full text-left p-4 rounded-lg border transition-all ";
            
            if (isSubmitted) {
              if (index === currentQuestion.correctAnswer) {
                optionClass += "bg-green-50 border-green-200 text-green-800 font-medium";
              } else if (index === selectedOption) {
                optionClass += "bg-red-50 border-red-200 text-red-800";
              } else {
                optionClass += "border-gray-200 text-gray-500 opacity-50";
              }
            } else {
              if (selectedOption === index) {
                optionClass += "border-bio-mint bg-bio-mint/10 text-bio-mint-dark font-medium shadow-sm";
              } else {
                optionClass += "border-gray-200 hover:border-bio-mint/50 hover:bg-gray-50 text-gray-700";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isSubmitted}
                className={optionClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isSubmitted && index === currentQuestion.correctAnswer && <CheckCircle size={20} className="text-green-600" />}
                  {isSubmitted && index === selectedOption && index !== currentQuestion.correctAnswer && <XCircle size={20} className="text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isSubmitted && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm border border-blue-100">
          <span className="font-bold block mb-1 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Açıklama:</span>
          {currentQuestion.explanation}
        </div>
      )}

      <div className="flex justify-end">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-6 py-3 bg-bio-mint text-white font-bold rounded-xl hover:bg-bio-mint-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-bio-mint/20"
          >
            Cevabı Kontrol Et
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-2 shadow-lg"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
