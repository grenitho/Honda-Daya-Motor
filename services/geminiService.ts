
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiBikeResponse } from "../types.ts";

export const generateBikeDetails = async (bikeName: string): Promise<GeminiBikeResponse> => {
  // Hanya jalankan jika API_KEY tersedia
  if (!process.env.API_KEY) {
    throw new Error("API_KEY tidak dikonfigurasi di environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan spesifikasi resmi Honda "${bikeName}" dalam format JSON Bahasa Indonesia. Fokus pada data teknis yang akurat untuk pasar Indonesia.`,
      config: {
        systemInstruction: "Anda adalah asisten dealer Honda. Berikan data spesifikasi motor dalam JSON. Jika nama motor tidak dikenal, berikan data default kosong tapi tetap dalam format JSON yang benar.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            specs: {
              type: Type.OBJECT,
              properties: {
                engine: { type: Type.STRING },
                power: { type: Type.STRING },
                torque: { type: Type.STRING },
                transmission: { type: Type.STRING },
                fuelCapacity: { type: Type.STRING }
              }
            },
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI tidak merespon");
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
