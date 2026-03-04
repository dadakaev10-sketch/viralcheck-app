import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const platform = formData.get('platform') || 'Instagram Post';
    const category = formData.get('category') || 'Lifestyle';

    if (!imageFile) {
      return Response.json({ error: 'Kein Bild hochgeladen.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'GEMINI_API_KEY fehlt in .env.local' }, { status: 500 });
    }

    // Convert to base64
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = imageFile.type || 'image/jpeg';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' });

    const prompt = `Du bist ein Social-Media-Experte und analysierst Bilder auf ihr Viral-Potenzial.

Analysiere dieses Bild für die Plattform "${platform}" in der Kategorie "${category}".
Antworte NUR mit validem JSON, ohne Markdown-Codeblöcke, ohne Erklärungen davor oder danach.

JSON-Format (alle Felder erforderlich):
{
  "viralScore": <Ganzzahl 0-100>,
  "imageContent": "<Was ist auf dem Bild zu sehen? 1-2 Sätze>",
  "personSichtbar": <true oder false>,
  "textOverlay": <true oder false>,
  "scores": {
    "bildqualitaet": <0-100>,
    "hookFaktor": <0-100>,
    "trendRelevanz": <0-100>,
    "engagementPotenzial": <0-100>
  },
  "wasGutIst": [
    "<konkreter positiver Punkt 1>",
    "<konkreter positiver Punkt 2>",
    "<konkreter positiver Punkt 3>"
  ],
  "wasVerbessern": [
    "<konkreter Verbesserungstipp 1>",
    "<konkreter Verbesserungstipp 2>",
    "<konkreter Verbesserungstipp 3>"
  ],
  "bestPostingTime": "<z.B. Di–Do, 18:00–20:00 Uhr>",
  "trendWindow": "<aktueller Trend + Veränderung in %, z.B. 'Morning Routine ↑ 23%'>",
  "captions": {
    "locker": "<kurze lockere Caption mit passenden Emojis, max 100 Zeichen>",
    "storytelling": "<emotionale Caption mit Story, 150-250 Zeichen>",
    "cta": "<Caption mit klarem Call-to-Action und Frage ans Publikum, 180-280 Zeichen>"
  },
  "hashtags": {
    "trending": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "nische": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
    "micro": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7"]
  }
}`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: base64, mimeType } },
    ]);

    const rawText = result.response.text().trim();

    // Strip markdown code fences if model adds them anyway
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

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
