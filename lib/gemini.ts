import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// IMPORTANT: Using API keys in the browser exposes them to users.
// For production, proxy requests via a backend. This helper is for rapid prototyping only.

const GEMINI_API_KEY = (typeof process !== 'undefined' && (process as any).env?.GEMINI_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

let model: GenerativeModel | null = null;

export function getGeminiModel(modelName: string = "gemini-2.5-flash") {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Create a .env file and set GEMINI_API_KEY.");
  }
  const client = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = client.getGenerativeModel({ model: modelName });
  return model;
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || result; // data:*;base64,XXXX
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function tryGeminiInlineImage({
  file,
  base64,
  effectPrompt,
  modelName,
}: {
  file: File;
  base64: string;
  effectPrompt: string;
  modelName: string;
}): Promise<string | null> {
  const generativeModel = getGeminiModel(modelName);
  const input = [
    {
      role: "user",
      parts: [
        { text: `${effectPrompt}\nReturn a single high-quality PNG image as inline data.` },
        {
          inlineData: {
            mimeType: file.type || "image/png",
            data: base64,
          },
        },
      ],
    },
  ];

  const result = await generativeModel.generateContent({ contents: input as any });
  const parts = (result.response.candidates?.[0]?.content?.parts || []) as any[];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart?.inlineData?.data) return null;
  return `data:image/png;base64,${imagePart.inlineData.data as string}`;
}

async function tryImagesAPI({
  file,
  base64,
  effectPrompt,
}: {
  file: File;
  base64: string;
  effectPrompt: string;
}): Promise<string> {
  const endpoint = `/ai/v1beta/models/imagegeneration:generate?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const body: any = {
    prompt: { text: effectPrompt },
    image: { mimeType: file.type || "image/png", data: base64 },
    imageGenerationConfig: { numberOfImages: 1, responseMimeType: "image/png" },
  };
  const resp = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(
      `Images API request failed (${resp.status}). Enable Images API or use an image-capable Gemini preview model. Details: ${text}`
    );
  }
  const data = await resp.json();
  const possibleBase64 =
    data?.images?.[0]?.data ||
    data?.images?.[0]?.bytesBase64 ||
    data?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.data)?.inlineData?.data;
  if (!possibleBase64 || typeof possibleBase64 !== "string") {
    throw new Error("Images API did not return an image payload.");
  }
  return `data:image/png;base64,${possibleBase64}`;
}

/**
 * Preferred: gemini-2.5-flash-image-preview → fallback: gemini-2.5-flash → fallback: Images API
 */
export async function generateEffectImage({
  file,
  effectPrompt,
}: {
  file: File;
  effectPrompt: string;
}): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Create a .env file and set GEMINI_API_KEY.");
  }

  const base64 = await fileToBase64(file);

  // 1) Try gemini-2.5-flash-image-preview (requested)
  try {
    const viaPreview = await tryGeminiInlineImage({
      file,
      base64,
      effectPrompt,
      modelName: "gemini-2.5-flash-image-preview",
    });
    if (viaPreview) return viaPreview;
  } catch (_) {
    // continue to fallback
  }

  // 2) Try gemini-2.5-flash
  try {
    const viaFlash = await tryGeminiInlineImage({
      file,
      base64,
      effectPrompt,
      modelName: "gemini-2.5-flash",
    });
    if (viaFlash) return viaFlash;
  } catch (_) {
    // continue to fallback
  }

  // 3) Fallback to Images API
  return await tryImagesAPI({ file, base64, effectPrompt });
}


