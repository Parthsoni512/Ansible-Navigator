import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchTopicContent = async (topic: string): Promise<string> => {
  try {
    const prompt = `You are an expert Ansible instructor. Your student wants to learn about "${topic}".
    
Provide a detailed, clear, and comprehensive explanation suitable for a beginner to mid-level developer. 
Structure your response with the following sections:
- A brief introduction to the concept.
- Core principles and key details, using bullet points or numbered lists.
- Practical examples using YAML code blocks where appropriate.
- A concluding summary of the key takeaways.

Format your response using markdown. Ensure code blocks are properly formatted with \`\`\`yaml.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching topic content:", error);
    return "Sorry, I couldn't fetch the content for this topic. Please try again later.";
  }
};


export const answerQuery = async (query: string, chatHistory: Message[], thinkingMode: boolean): Promise<string> => {
  const modelName = thinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  const config = thinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

  const historyPrompt = chatHistory
    .map(msg => `${msg.role}: ${msg.text}`)
    .join('\n');
  
  const fullPrompt = `${historyPrompt}\nuser: ${query}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      // FIX: `systemInstruction` must be a property of the `config` object.
      config: {
        ...config,
        systemInstruction: "You are an expert Ansible instructor and troubleshooter. Provide clear, accurate, and concise answers to the user's questions. Use markdown for formatting and provide YAML code examples when helpful.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error answering query:", error);
    return "I apologize, but I encountered an error while processing your request. Please try again.";
  }
};
