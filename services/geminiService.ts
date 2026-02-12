
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiBikeResponse } from "../types.ts";

export const generateBikeDetails = async (bikeName: string): Promise<GeminiBikeResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("Kunci API (API_KEY) belum dikonfigurasi di environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan spesifikasi lengkap dan deskripsi menarik untuk unit motor Honda: ${bikeName}`,
      config: {
        systemInstruction: "Anda adalah pakar produk sepeda motor Honda di Indonesia. Tugas Anda adalah memberikan data spesifikasi teknis yang akurat, pilihan warna resmi, dan deskripsi pemasaran yang persuasif dalam Bahasa Indonesia. Pastikan output selalu dalam format JSON sesuai skema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { 
              type: Type.STRING,
              description: "Nama lengkap unit motor sesuai branding resmi Astra Honda Motor"
            },
            price: { 
              type: Type.STRING,
              description: "Estimasi harga OTR Jakarta terbaru dalam format 'Rp 00.000.000'"
            },
            category: { 
              type: Type.STRING, 
              enum: ['Matic', 'Sport', 'Cub', 'EV', 'Big Bike'] 
            },
            description: { 
              type: Type.STRING,
              description: "Deskripsi singkat namun menarik (minimal 2 paragraf) tentang keunggulan motor ini untuk calon pembeli"
            },
            specs: {
              type: Type.OBJECT,
              properties: {
                engine: { type: Type.STRING, description: "Tipe mesin, cc, dan teknologi (e.g. eSP+)" },
                power: { type: Type.STRING, description: "Tenaga maksimum" },
                torque: { type: Type.STRING, description: "Torsi maksimum" },
                transmission: { type: Type.STRING, description: "Tipe transmisi" },
                fuelCapacity: { type: Type.STRING, description: "Kapasitas tangki BBM dalam Liter" }
              },
              required: ['engine', 'power', 'torque', 'transmission', 'fuelCapacity']
            },
            features: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Daftar fitur unggulan (minimal 4 fitur)"
            },
            colors: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Daftar pilihan warna resmi"
            }
          },
          required: ['name', 'price', 'category', 'description', 'specs', 'features', 'colors']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Model AI tidak memberikan respon teks.");
    }

    const parsedData = JSON.parse(text.trim());
    return parsedData;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('403') || error.message?.includes('API_KEY_INVALID')) {
      throw new Error("Kunci API tidak valid atau tidak memiliki akses ke Gemini 3.");
    }
    throw new Error(`Gagal memproses data unit: ${error.message || 'Error tidak diketahui'}`);
  }
};
