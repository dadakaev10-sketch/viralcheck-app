export const maxDuration = 120;

export async function POST(request) {
  try {
    const { improvements, imageContent, imageBase64, imageMimeType, platform, category } = await request.json();

    if (!improvements || !Array.isArray(improvements) || improvements.length === 0) {
      return Response.json({ error: 'Keine Verbesserungsvorschläge gefunden.' }, { status: 400 });
    }

    const apiKey = process.env.XAI_IMAGE_API_KEY || process.env.XAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'XAI_API_KEY fehlt in .env.local' }, { status: 500 });
    }

    // Build prompt: keep original image, apply analysis improvements + lighting/contrast
    const enhancementPrompt = `Take this exact image and apply these improvements:

IMPROVEMENTS FROM ANALYSIS:
${improvements.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

ALSO IMPROVE:
- Professional lighting (softer, more flattering)
- Contrast and color grading
- Cleaner, more polished overall look
- If person looks neutral/serious: add a subtle natural smile only

STRICT RULES - DO NOT CHANGE:
- Keep the same person with identical face, appearance, clothing, and hairstyle
- Keep the same room, background, furniture, and layout
- Keep the same composition and camera angle
- Do NOT add or remove any objects or people
- Do NOT change the setting or environment

This must look like the SAME photo, just professionally enhanced. Platform: ${platform} | Category: ${category}`;

    // Send original image directly to grok-imagine-image (supports image input)
    const requestBody = {
      model: 'grok-imagine-image',
      prompt: enhancementPrompt,
      n: 1,
      aspect_ratio: '1:1',
      resolution: '1k',
      response_format: 'b64_json',
    };

    // Attach original image as input if available
    if (imageBase64) {
      requestBody.image = {
        url: `data:${imageMimeType || 'image/jpeg'};base64,${imageBase64}`,
      };
    }

    const response = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'X.AI Image Generation error');
    }

    const data = await response.json();
    const base64Image = data.data[0].b64_json;

    return Response.json({
      image: `data:image/png;base64,${base64Image}`,
      prompt: enhancementPrompt,
    });

  } catch (error) {
    console.error('Regenerate image error:', error);
    return Response.json(
      { error: error.message || 'Bilderzeugung fehlgeschlagen. Bitte erneut versuchen.' },
      { status: 500 }
    );
  }
}
