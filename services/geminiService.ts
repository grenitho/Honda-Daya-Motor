
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiBikeResponse } from "../types.ts";

export const generateBikeDetails = async (bikeName: string): Promise<GeminiBikeResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key tidak ditemukan. Pastikan environment API_KEY sudah diset.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Menggunakan gemini-3-pro-preview untuk tugas ekstraksi data yang kompleks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Tolong berikan detail spesifikasi teknis dan deskripsi pemasaran untuk motor Honda: "${bikeName}". Berikan data yang paling akurat sesuai informasi terbaru di Indonesia.`,
      config: {
        systemInstruction: "Anda adalah pakar spesifikasi motor Honda. Anda harus selalu merespon dengan format JSON murni tanpa teks tambahan. Gunakan Bahasa Indonesia yang sopan dan profesional.",
        thinkingConfig: { thinkingBudget: 2048 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.STRING },
            category: { 
              type: Type.STRING, 
              enum: ['Matic', 'Sport', 'Cub', 'EV', 'Big Bike'] 
            },
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
              items: { type: Type.STRING }
            }
          },
          required: ['name', 'price', 'category', 'description', 'specs', 'features', 'colors']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Respon AI kosong atau diblokir oleh filter keamanan.");
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text:", text);
      throw new Error("Format data yang diterima dari AI tidak valid.");
    }
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // Memberikan pesan error yang lebih informatif ke UI
    let errorMessage = "Terjadi kesalahan saat menghubungi server AI.";
    
    if (error.message?.includes('403')) {
      errorMessage = "Akses ditolak (403). Periksa apakah API Key Anda memiliki izin untuk model Gemini 3 Pro.";
    } else if (error.message?.includes('429')) {
      errorMessage = "Terlalu banyak permintaan (Rate Limit). Silakan tunggu sebentar.";
    } else if (error.message?.includes('400')) {
      errorMessage = "Permintaan tidak valid (400). Mungkin nama unit terlalu pendek atau mengandung kata terlarang.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
