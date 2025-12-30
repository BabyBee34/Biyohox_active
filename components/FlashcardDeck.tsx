import React, { useState } from 'react';
import { RotateCw, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { Flashcard } from '../types';
import { motion } from 'framer-motion';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 300);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 300);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (!cards || cards.length === 0) {
      return <div className="text-center text-gray-400 py-10">Gösterilecek kart bulunamadı.</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-2">
           <Layers size={16} />
           <span>{cards.length} Kart</span>
        </div>
        <span>{currentIndex + 1} / {cards.length}</span>
      </div>

      <div 
        className="relative h-72 cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <motion.div 
            className="relative w-full h-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
        >
           {/* Front Face */}
           <div 
             className="absolute w-full h-full bg-white rounded-2xl shadow-lg border-b-4 border-primary-500 p-8 flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow"
             style={{ backfaceVisibility: 'hidden' }}
           >
             <span className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-6 bg-primary-50 px-3 py-1 rounded-full">Kavram</span>
             <h3 className="text-3xl font-extrabold text-gray-800 leading-tight">{cards[currentIndex].front}</h3>
             <p className="mt-auto text-sm text-gray-400 flex items-center gap-2 animate-pulse">
               <RotateCw size={14} /> Çevirmek için tıkla
             </p>
           </div>

           {/* Back Face */}
           <div 
             className="absolute w-full h-full bg-slate-800 rounded-2xl shadow-lg border-b-4 border-slate-600 p-8 flex flex-col items-center justify-center text-center"
             style={{ 
                 backfaceVisibility: 'hidden', 
                 transform: 'rotateY(180deg)' 
             }}
           >
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 bg-slate-700 px-3 py-1 rounded-full">Açıklama</span>
             <div className="overflow-y-auto max-h-full w-full custom-scrollbar">
                <p className="text-xl text-white leading-relaxed font-medium">{cards[currentIndex].back}</p>
             </div>
           </div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="p-4 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-primary-600 transition-colors transform hover:scale-110 active:scale-95"
          title="Önceki Kart"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="p-4 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-primary-600 transition-colors transform hover:scale-110 active:scale-95"
          title="Sonraki Kart"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;