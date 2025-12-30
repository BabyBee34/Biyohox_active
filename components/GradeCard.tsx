
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, ArrowRight } from 'lucide-react';
import { Grade } from '../types';

interface GradeCardProps {
  grade: Grade;
  index: number;
  uniform?: boolean;
}

const GradeCard: React.FC<GradeCardProps> = ({ grade, index, uniform = false }) => {
  // Mock size variation for asymmetric grid (only if not uniform)
  const isLarge = !uniform && (index === 0 || index === 3);

  return (
    <Link 
      to={`/dersler/${grade.slug}`}
      className={`group relative overflow-hidden glass-card rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,217,163,0.3)] flex flex-col justify-between ${isLarge ? 'md:col-span-2' : 'md:col-span-1'} h-full min-h-[240px]`}
    >
      {/* Decorative Gradient Blob */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-bio-mint/20 to-bio-lavender/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

      <div>
        <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 rounded-2xl bg-bio-mint text-white flex items-center justify-center text-3xl font-bold font-display shadow-lg shadow-bio-mint/30 group-hover:scale-110 transition-transform duration-300">
                {grade.id}
            </div>
            <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-slate-400 group-hover:bg-bio-mint group-hover:text-white transition-all duration-300">
                <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
        </div>
        
        <h3 className="text-2xl font-bold font-display text-slate-800 mb-2 group-hover:text-bio-mint-dark transition-colors">
            {grade.name}
        </h3>
        <p className="text-slate-500 text-sm">Müfredata uygun güncel içerik</p>
      </div>
      
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-200/50">
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white/50 px-3 py-1.5 rounded-lg">
          <Layers size={16} className="text-bio-lavender-dark" />
          <span>{grade.unitCount} Ünite</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white/50 px-3 py-1.5 rounded-lg">
          <BookOpen size={16} className="text-bio-cyan" />
          <span>{grade.lessonCount} Ders</span>
        </div>
      </div>
    </Link>
  );
};

export default GradeCard;
