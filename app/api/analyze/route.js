import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const platform  = formData.get('platform') || 'Instagram Post';
    const category  = formData.get('category') || 'Lifestyle';
    const language  = formData.get('language') || 'de';

    // Language instruction injected into the prompt
    const langInstruction = {
      de: 'Schreibe alle Textwerte auf Deutsch.',
      en: 'Write all text field values in English.',
      ru: 'Напиши все текстовые значения на русском языке.',
    }[language] || 'Schreibe alle Textwerte auf Deutsch.';

    if (!imageFile) {
      return Response.json({ error: 'Kein Bild hochgeladen.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'GEMINI_API_KEY fehlt in .env.local' }, { status: 500 });
    }

    // Convert to base64
    const bytes  = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = imageFile.type || 'image/jpeg';

    const genAI     = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model     = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are a social media expert analyzing images for viral potential.
${langInstruction}

Analyze this image for the platform "${platform}" in the category "${category}".
Reply ONLY with valid JSON — no markdown code fences, no explanations before or after.

Required JSON format (all fields mandatory):
{
  "viralScore": <integer 0-100>,
  "imageContent": "<What is visible in the image? 1-2 sentences>",
  "personSichtbar": <true or false>,
  "textOverlay": <true or false>,
  "scores": {
    "bildqualitaet": <0-100>,
    "hookFaktor": <0-100>,
    "trendRelevanz": <0-100>,
    "engagementPotenzial": <0-100>
  },
  "wasGutIst": [
    "<specific positive point 1>",
    "<specific positive point 2>",
    "<specific positive point 3>"
  ],
  "wasVerbessern": [
    "<specific improvement tip 1>",
    "<specific improvement tip 2>",
    "<specific improvement tip 3>"
  ],
  "bestPostingTime": "<e.g. Tue–Thu, 6–8 PM>",
  "trendWindow": "<current trend + change in %, e.g. 'Morning Routine ↑ 23%'>",
  "captions": {
    "locker": "<short casual caption with fitting emojis, max 100 chars>",
    "storytelling": "<emotional caption with story, 150-250 chars>",
    "cta": "<caption with clear call-to-action and question to audience, 180-280 chars>"
  },
  "hashtags": {
    "trending": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "nische":   ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
    "micro":    ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7"]
  }
}`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: base64, mimeType } },
    ]);

    const rawText = result.response.text().trim();

    // Strip markdown code fences if model adds them anyway
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const analysis = JSON.parse(cleaned);
    return Response.json(analysis);

  } catch (error) {
    console.error('Analyze error:', error);
    return Response.json(
      { error: error.message || 'Analyse fehlgeschlagen. Bitte erneut versuchen.' },
      { status: 500 }
    );
  }
}
