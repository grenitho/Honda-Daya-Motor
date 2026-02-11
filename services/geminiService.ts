
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiBikeResponse } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBikeDetails = async (bikeName: string): Promise<GeminiBikeResponse> => {
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

  const text = response.text;
  if (!text) throw new Error("Gagal mendapatkan data dari AI.");
  return JSON.parse(text.trim());
};
