
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiBikeResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBikeDetails = async (bikeName: string): Promise<GeminiBikeResponse> => {
  // Use gemini-3-pro-preview for complex reasoning and structured JSON output tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Provide detailed specifications and available official colors for the Honda motorcycle named "${bikeName}". Format the response as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          price: { type: Type.STRING, description: "Estimated price in Indonesian Rupiah (IDR) starting with 'Rp '" },
          category: { type: Type.STRING, enum: ['Matic', 'Sport', 'Cub', 'EV', 'Big Bike'] },
          description: { type: Type.STRING },
          specs: {
            type: Type.OBJECT,
            properties: {
              engine: { type: Type.STRING },
              power: { type: Type.STRING },
              torque: { type: Type.STRING },
              transmission: { type: Type.STRING },
              fuelCapacity: { type: Type.STRING }
            },
            required: ['engine', 'power', 'torque', 'transmission', 'fuelCapacity']
          },
          features: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          colors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of available color names, e.g., ['Matte Black', 'Candy Red']"
          }
        },
        required: ['name', 'price', 'category', 'description', 'specs', 'features', 'colors']
      }
    }
  });

  // Extract text content directly from the .text property of the response object
  const text = response.text;
  if (!text) {
    throw new Error("Gemini API failed to return content.");
  }
  return JSON.parse(text.trim());
};
