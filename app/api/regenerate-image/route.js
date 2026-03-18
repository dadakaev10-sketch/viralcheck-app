export const maxDuration = 120;

export async function POST(request) {
  try {
    const { improvements, imageContent, platform, category } = await request.json();

    if (!improvements || !Array.isArray(improvements) || improvements.length === 0) {
      return Response.json({ error: 'Keine Verbesserungsvorschläge gefunden.' }, { status: 400 });
    }

    const apiKey = process.env.XAI_IMAGE_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'XAI_IMAGE_API_KEY fehlt in .env.local' }, { status: 500 });
    }

    // Build enhancement prompt from improvements
    const enhancementPrompt = `Enhance this image for ${platform} in the ${category} category.

**CRITICAL RULES:**
- Keep the same person(s), room, and composition - DO NOT change faces or fundamental layout
- Only improve: lighting, contrast, colors, minimal decor/props, and professionalism
- Maximum facial change: subtle smile or slight better expression (same person)
- Keep identity and context exactly the same

**Enhancement suggestions to implement:**
${improvements.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

Original concept: ${imageContent}

Make the image look more professional, well-lit, and visually appealing for social media without changing the core subject or faces.`;

    const response = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-imagine-image',
        prompt: enhancementPrompt,
        n: 1,
        aspect_ratio: '1:1',
        resolution: '1k',
        response_format: 'b64_json',
      }),
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
