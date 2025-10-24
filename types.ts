
export interface CurriculumTopic {
  title: string;
  subtopics: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}
