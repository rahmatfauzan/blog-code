// app/api/generate-meta/route.ts

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Rate limiting (simple in-memory)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 10;
  const window = 60 * 1000;

  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + window });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// ✅ SMART MODEL FALLBACK (dari tercepat ke paling reliable)
const MODELS_PRIORITY = [
  "gemini-2.0-flash", // Fastest, try first
  "gemini-2.0-flash-lite", // Faster, higher RPM
  "gemini-2.5-flash-lite", // Alternative
  "gemini-2.5-flash", // Stable backup
];

async function generateWithFallback(genAI: GoogleGenerativeAI, prompt: string) {
  let lastError: any = null;

  // Try each model in priority order
  for (const modelName of MODELS_PRIORITY) {
    try {
      console.log(`🤖 Trying model: ${modelName}`);

      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();

      if (responseText) {
        console.log(`✅ Success with model: ${modelName}`);
        return { text: responseText, model: modelName };
      }
    } catch (error: any) {
      console.log(`❌ Failed with ${modelName}:`, error.message);
      lastError = error;

      // If quota exceeded (429), try next model
      if (error.status === 429 || error.message?.includes("quota")) {
        console.log(`⚠️ Quota exceeded for ${modelName}, trying next...`);
        continue;
      }

      // If 404 (model not found), try next model
      if (error.status === 404) {
        console.log(`⚠️ Model ${modelName} not found, trying next...`);
        continue;
      }

      // For other errors, throw immediately
      throw error;
    }
  }

  // All models failed
  throw new Error(
    `All models failed. Last error: ${lastError?.message || "Unknown error"}`
  );
}

export async function POST(request: NextRequest) {
  try {
    // ✅ Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak request. Coba lagi nanti." },
        { status: 429 }
      );
    }

    // ✅ Validate input
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title dan content wajib diisi" },
        { status: 400 }
      );
    }

    if (title.length < 5) {
      return NextResponse.json(
        { error: "Title terlalu pendek (min 5 karakter)" },
        { status: 400 }
      );
    }

    // ✅ Check API key
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error("GOOGLE_AI_API_KEY not configured");
      return NextResponse.json(
        { error: "AI service belum dikonfigurasi" },
        { status: 500 }
      );
    }

    // ✅ Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

    // ✅ Smart content truncation
    const contentPreview = content.substring(0, 600);

    // ✅ Detect language
    const isIndonesian =
      /[a-zA-Z]/.test(title) &&
      /yang|dan|atau|dengan|untuk|dari|ke|di|ini|itu/.test(contentPreview);
    const language = isIndonesian ? "Bahasa Indonesia" : "English";

    // ✅ Build prompt
    const prompt = `Kamu adalah SEO expert yang ahli membuat meta tags untuk artikel tech/coding.

TUGAS: Buatkan meta tags yang optimal untuk artikel berikut.

JUDUL ARTIKEL:
${title}

KONTEN (preview 600 karakter pertama):
${contentPreview}

ATURAN PENTING:
1. **meta_title**: 
   - WAJIB 45-60 karakter (optimal untuk Google)
   - Catchy, mengandung keyword utama
   - Hindari clickbait berlebihan
   - Tambahkan angka jika relevan (contoh: "5 Cara...", "Top 10...")

2. **meta_description**: 
   - WAJIB 120-160 karakter
   - Persuasif, buat orang ingin klik
   - Highlight benefit/value proposition
   - Include call-to-action ringan

3. **meta_keywords**: 
   - 5-7 keywords yang sangat relevan
   - Mix antara broad keywords & long-tail keywords
   - Gunakan lowercase
   - Fokus pada tech stack yang disebutkan

4. **Bahasa**: Gunakan ${language}

OUTPUT FORMAT (WAJIB JSON VALID):
{
  "meta_title": "Judul SEO optimal (45-60 char)",
  "meta_description": "Deskripsi persuasif untuk Google SERP (120-160 char)",
  "meta_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

CONTOH GOOD OUTPUT:
{
  "meta_title": "Next.js Auth: 5 Best Practices untuk Production",
  "meta_description": "Pelajari cara implement authentication di Next.js 15 dengan Supabase. Termasuk protected routes, session management, dan security best practices.",
  "meta_keywords": ["nextjs authentication", "supabase auth", "nextjs 15", "protected routes", "session management", "web security"]
}

CRITICAL: Output HANYA JSON tanpa markdown backticks atau teks tambahan!`;

    // ✅ Call Gemini API with Fallback
    const { text: responseText, model: usedModel } = await generateWithFallback(
      genAI,
      prompt
    );

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    // ✅ Clean markdown artifacts
    const cleanedText = responseText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // ✅ Parse JSON
    let metaData;
    try {
      metaData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", cleanedText);
      throw new Error("AI response bukan JSON valid");
    }

    // ✅ Validate output structure
    if (
      !metaData.meta_title ||
      !metaData.meta_description ||
      !Array.isArray(metaData.meta_keywords)
    ) {
      throw new Error("AI response tidak lengkap");
    }

    // ✅ Validate length constraints
    if (metaData.meta_title.length > 60) {
      metaData.meta_title = metaData.meta_title.substring(0, 60);
    }

    if (metaData.meta_description.length > 160) {
      metaData.meta_description = metaData.meta_description.substring(0, 160);
    }

    // Limit keywords to max 10
    if (metaData.meta_keywords.length > 10) {
      metaData.meta_keywords = metaData.meta_keywords.slice(0, 10);
    }

    // ✅ Return success with model info
    return NextResponse.json({
      success: true,
      data: metaData,
      model_used: usedModel, // Info model mana yang berhasil
    });
  } catch (error: any) {
    console.error("AI Meta Generation Error:", error);

    // ✅ User-friendly error messages
    if (error.message?.includes("API_KEY_INVALID")) {
      return NextResponse.json(
        { error: "API key tidak valid" },
        { status: 500 }
      );
    }

    if (error.message?.includes("All models failed")) {
      return NextResponse.json(
        {
          error: "Semua model AI sedang sibuk. Coba lagi dalam 1 menit.",
          hint: "Atau coba isi meta secara manual terlebih dahulu.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Gagal generate meta dengan AI. Silakan coba lagi.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
