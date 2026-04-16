import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Question {
  topic: string;
  content: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const TOPICS = [
  "Sampling Methods",
  "Probability (Conditional, Independent, Bayes)",
  "Normal Distribution",
  "Confidence Intervals",
  "Hypothesis Testing"
];

const CONTEXT_OCR = `
Final Exam Practice Problems
1. Sampling types: Random, Convenience, Systematic, Simple Random, Stratified.
2. Bayes' Theorem / Conditional Probability: Machine setup correctly vs good parts.
3. Independent events: Dave and Mike showing up.
4. Conditional Probability calculation: P(A|B) given P(A), P(B|A), P(B|Ac).
5. Normal Distribution: Hereford cattle weights, probability of weight ranges.
6. Confidence Intervals: Mean years of education, margin of error, 95% CI.
7. Sample size calculation: Margin of error for mean score.
8. Confidence Intervals: Cereal boxes filling weight, 90% CI.
9. Hypothesis testing: Mean height of Americans increased.
10. Hypothesis testing: Mean height less than 40.
11. Hypothesis testing: Sales strategy effectiveness (mean purchase amount).
12. Hypothesis testing: Coffee shop dwell time.
`;

export async function generateSimilarQuestion(topic?: string): Promise<Question> {
  const selectedTopic = topic || TOPICS[Math.floor(Math.random() * TOPICS.length)];
  
  const prompt = `
    You are a statistics professor creating practice problems for a final exam.
    Based on the following context of existing problems:
    ${CONTEXT_OCR}

    Generate ONE new practice question for the topic: "${selectedTopic}".
    The question should be similar in style and difficulty to the examples but use a different application/scenario.
    Provide 4 multiple-choice options.
    Provide a detailed step-by-step explanation for the correct answer.

    Return the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            content: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctOptionIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
          },
          required: ["topic", "content", "options", "correctOptionIndex", "explanation", "difficulty"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as Question;
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
}

export async function generateBatchQuestions(count: number = 5): Promise<Question[]> {
  const prompt = `
    You are a statistics professor creating practice problems for a final exam.
    Based on the following context of existing problems:
    ${CONTEXT_OCR}

    Generate ${count} new practice questions.
    Ensure variety across these topics: ${TOPICS.join(", ")}.
    Each question should use a different application/scenario.
    Provide 4 multiple-choice options for each.
    Provide a detailed step-by-step explanation for the correct answer.

    Return the result as a JSON array of questions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              content: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctOptionIndex: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
            },
            required: ["topic", "content", "options", "correctOptionIndex", "explanation", "difficulty"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]") as Question[];
  } catch (error) {
    console.error("Error generating batch:", error);
    throw error;
  }
}
