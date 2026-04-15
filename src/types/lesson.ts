export interface LessonSection {
  subtitle: string;
  content: string;
  examples?: string[];
}

export interface LessonTheoryBlock {
  title: string;
  sections: LessonSection[];
}

export interface LessonContent {
  id: string;
  title: string;
  theory: LessonTheoryBlock[];
}