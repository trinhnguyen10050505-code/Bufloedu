export interface RawQuestion {
  id: string;
  lessonId: string;
  level: "nhanbiet" | "thonghieu" | "vandung";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}