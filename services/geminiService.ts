
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiBikeResponse, MotorcycleCategory } from "../types.ts";

export const generateBikeDetails = async (bikeName: string, category: MotorcycleCategory): Promise<GeminiBikeResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY tidak dikonfigurasi.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan data spesifikasi teknis resmi motor Honda "${bikeName}" dengan kategori "${category}" khusus untuk pasar Indonesia (AHM).`,
      config: {
        systemInstruction: `Anda adalah database teknis motor Honda Indonesia. 
        Tugas Anda: Memberikan spesifikasi akurat dalam format JSON. 
        PENTING: 
        1. Gunakan Nama resmi yang beredar di Indonesia. 
        2. Harga harus dalam format string (Contoh: "Rp 20.000.000"). 
        3. Jika motor adalah model terbaru (seperti New Beat 2024 atau Stylo 160), berikan data terbaru.
        4. Jika data tidak ditemukan, berikan perkiraan terdekat berdasarkan kategori ${category}.`,
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
