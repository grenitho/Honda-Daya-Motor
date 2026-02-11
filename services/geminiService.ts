
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiBikeResponse } from "../types";

// Fungsi untuk inisialisasi AI secara aman
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("PERINGATAN: API_KEY belum diset di Environment Variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBikeDetails = async (bikeName: string): Promise<GeminiBikeResponse> => {
  const ai = getAIClient();
  
  if (!ai) {
    throw new Error("API Key Gemini tidak ditemukan. Harap hubungi admin.");
  }

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

  const text = response.text;
  if (!text) {
    throw new Error("Gemini API gagal memberikan respon.");
  }
  return JSON.parse(text.trim());
};
