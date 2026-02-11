
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiBikeResponse } from "../types.ts";

// Fix: Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) as per guidelines
// Fix: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBikeDetails = async (bikeName: string): Promise<GeminiBikeResponse> => {
  // Fix: Use the ai instance directly as recommended in the initialization guidelines
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Provide detailed specifications and official colors for Honda ${bikeName} in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          price: { type: Type.STRING },
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
          features: { type: Type.ARRAY, items: { type: Type.STRING } },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['name', 'price', 'category', 'description', 'specs', 'features', 'colors']
      }
    }
  });

  // Fix: Access response.text property directly (not as a method call response.text())
  const text = response.text;
  if (!text) throw new Error("Gagal mendapatkan data dari AI.");
  return JSON.parse(text.trim());
};
