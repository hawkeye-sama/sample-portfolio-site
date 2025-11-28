import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { CHAT_SYSTEM_INSTRUCTION } from "../constants";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please set process.env.API_KEY.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

// Initialize or retrieve the chat session
export const getChatSession = (): Chat => {
  if (!chatSession) {
    const client = getAIClient();
    // Using gemini-3-pro-preview as requested for complex reasoning capabilities
    // Enabled thinking mode with 32k budget for enhanced reasoning
    chatSession = client.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = getChatSession();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const analyzeImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const client = getAIClient();
    // Using gemini-3-pro-preview for high quality image understanding
    // Enabled thinking mode with 32k budget for detailed analysis
    const response = await client.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: prompt || "Analyze this image and tell me what you see in the context of web development or design.",
          },
        ],
      },
      config: {
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};