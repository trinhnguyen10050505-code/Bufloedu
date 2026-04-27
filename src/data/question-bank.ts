import { normalizeQuestionBank } from "@/lib/question-utils";
import { rawQuestionBank } from "./question-bank-raw";

export const questionBank = normalizeQuestionBank(rawQuestionBank);