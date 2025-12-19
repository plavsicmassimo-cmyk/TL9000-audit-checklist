
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = 'gemini-3-flash-preview';

// Expert explanation for TL 9000 requirements
export const getAIExplanation = async (clause: string, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a TL 9000 QMS expert. 
Explain the following requirement clearly and provide 3 concrete examples of evidence that an auditor would look for. 
Keep the explanation professional and concise.

Clause: ${clause}
Requirement: ${description}

Format the response in Markdown.`;

  try {
    // Correctly using ai.models.generateContent and extracting text from response property
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating explanation. Please check your connection and try again.";
  }
};

// Internal audit questions generation
export const getAuditQuestions = async (clause: string, context: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `As a TL 9000 Internal Auditor, generate 5 key audit questions to ask a process owner about the following requirement:
  
Clause: ${clause}
Requirement: ${context}

Focus on both process adherence and measurement data if applicable.`;

  try {
    // Correctly using ai.models.generateContent and extracting text from response property
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating questions.";
  }
};
