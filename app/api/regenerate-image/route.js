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

    // Build category-specific prompt with different lighting, atmosphere, and styling
    const categoryPrompts = {
      'Business': {
        lighting: 'sharp, professional studio lighting with clean shadows',
        atmosphere: 'corporate, serious, competent, trustworthy',
        enhancement: 'crisp focus, clean background, formal business attire enhancement, executive presence'
      },
      'Luxury': {
        lighting: 'premium, cinematic lighting with subtle golden hour tones',
        atmosphere: 'sophisticated, elegant, high-end, premium',
        enhancement: 'luxurious color grading, soft glow, subtle shadows, premium finish'
      },
      'Lifestyle': {
        lighting: 'soft, natural golden light, warm and inviting',
        atmosphere: 'relaxed, authentic, approachable, natural',
        enhancement: 'warm color tones, soft focus elements, natural radiance'
      },
      'Travel': {
        lighting: 'bright, vibrant natural daylight with dynamic shadows',
        atmosphere: 'adventurous, energetic, vibrant, inspiring',
        enhancement: 'vibrant colors, clear details, dynamic composition feel'
      },
      'Food': {
        lighting: 'appetizing studio lighting, warm and welcoming',
        atmosphere: 'delicious, inviting, professional food styling',
        enhancement: 'food looks fresh and appetizing, warm color balance'
      },
      'Fitness': {
        lighting: 'bright, energetic lighting highlighting muscle definition',
        atmosphere: 'athletic, confident, strong, determined',
        enhancement: 'sharp focus, dynamic lighting, enhanced definition'
      }
    };

    const categoryConfig = categoryPrompts[category] || categoryPrompts['Lifestyle'];

    const enhancementPrompt = `Take this exact image and apply these improvements:

IMPROVEMENTS FROM ANALYSIS:
${improvements.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

CATEGORY-SPECIFIC ENHANCEMENT (${category}):
- Lighting: ${categoryConfig.lighting}
- Atmosphere: ${categoryConfig.atmosphere}
- Enhancement details: ${categoryConfig.enhancement}
- Adjust colors, tone, and mood to match the ${category} category
- If person looks neutral/serious: add a subtle natural smile only

STRICT RULES - DO NOT CHANGE:
- Keep the same person with identical face, appearance, clothing, and hairstyle
- Keep the same room, background, furniture, and layout
- Keep the same composition and camera angle
- Do NOT add or remove any objects or people
- Do NOT change the setting or environment

This must look like the SAME photo, just professionally enhanced for ${category} content. Platform: ${platform}`;

    // Use /v1/images/edits endpoint to edit the original image directly
    const requestBody = {
      model: 'grok-imagine-image',
      prompt: enhancementPrompt,
      image: {
        url: `data:${imageMimeType || 'image/jpeg'};base64,${imageBase64}`,
        type: 'image_url',
      },
      response_format: 'b64_json',
    };

    const response = await fetch('https://api.x.ai/v1/images/edits', {
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
