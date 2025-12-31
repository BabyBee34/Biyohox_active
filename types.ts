
export interface Grade {
  id: string;
  name: string;
  slug: string;
  unitCount: number;
  lessonCount: number;
  color: string;
  icon?: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface SubBlock {
  type: 'text' | 'video' | 'image' | 'quiz' | 'flashcard' | 'callout' | 'quote' | 'table' | 'list' | 'audio' | 'accordion' | 'steps' | 'file' | 'code';
  content?: string;
  data?: any;
}

export interface LessonBlock {
  id: string;
  type: 'text' | 'video' | 'image' | 'quiz' | 'flashcard' | 'callout' | 'split' | 'quote' | 'divider' | 'table' | 'list' | 'audio' | 'accordion' | 'steps' | 'file' | 'code';
  content?: string; // HTML for text
  data?: any; // Specific data for other types. For split: { left: SubBlock | null, right: SubBlock | null }
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  gradeId: string;
  unitId: string;
  duration: number;
  viewCount: number;
  description: string;
  coverImage?: string;
  isPublished?: boolean;
  blocks: LessonBlock[];
}

export interface Unit {
  id: string;
  gradeId: string;
  title: string;
  slug: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  lessons: { id: string; title: string; slug: string }[];
}

export interface StudyResource {
  id: string;
  type: 'pdf' | 'note'; // Distinguish between PDF file and Web Note
  title: string;
  grade: string; // "9. Sınıf"
  unit: string;  // "Hücre"
  topic?: string; // "Hücre Zarı"
  content?: string; // HTML content for 'note' type
  fileUrl?: string; // URL for 'pdf' type
  size?: string; // "2.4 MB" for pdf
  downloads?: number; // for pdf
  views?: number; // for note
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string; // Added content field
  image: string;
  tags: string[];
  readTime: number;
  date: string;
}
