import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The calculus problem statement. Use a mix of plain text and LaTeX for mathematical expressions. Use $...$ for inline math and $$...$$ for display math. For example: 'Find the derivative of $f(x) = x^2$'. Use double backslashes for LaTeX commands, e.g., \\\\frac{d}{dx} e^{2x}.",
    },
    answer: {
      type: Type.STRING,
      description: "A simplified string representation of the final answer for easy comparison. E.g., '2*e^(2x)', '5', '2*pi/3'. Do not include LaTeX.",
    },
    solution: {
      type: Type.STRING,
      description: "A detailed, step-by-step solution to the problem. Use a mix of plain text and LaTeX for mathematical expressions. Use $...$ for inline math and $$...$$ for display math. Use double backslashes for LaTeX commands.",
    },
  },
  required: ["question", "answer", "solution"],
};


export const generateCalculusProblem = async (topic: string, difficulty: Difficulty): Promise<Question | null> => {
  try {
    const prompt = `
      You are an expert calculus tutor creating practice problems for an adaptive learning game.
      Generate a single calculus problem on the topic of "${topic}".
      The difficulty of the problem should be "${difficulty}".

      - For "Easy" difficulty, create a straightforward problem involving basic concepts.
      - For "Medium" difficulty, create a problem that may require two steps or a common trick.
      - For "Hard" difficulty, create a problem that requires multiple steps, combines concepts, or involves more complex functions.
      - For "Challenge" difficulty, create a difficult problem that requires a deep understanding and possibly a clever insight to solve efficiently.

      Provide the output in a JSON object that matches the specified schema.
      For the 'answer' field, ensure it is in a format that can be easily checked for string equality. For example, if the answer is 2*pi, write "2*pi". If the answer is 5, write "5". If it's x^2, write "x^2".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1,
      }
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString) as Question;
    return parsed;

  } catch (error) {
    console.error("Error generating calculus problem:", error);
    return null;
  }
};
