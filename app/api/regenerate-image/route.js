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

    // STEP 1: Use Grok Vision to get a very detailed description of the original image
    // This ensures we preserve the person, room, and composition exactly
    let detailedDescription = imageContent || '';

    if (imageBase64) {
      const visionResponse = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-2-vision-latest',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${imageMimeType || 'image/jpeg'};base64,${imageBase64}`,
                  },
                },
                {
                  type: 'text',
                  text: `Describe this image in extreme detail for image reproduction. Include:
- Person: exact appearance (age, hair color/style, skin tone, clothing colors/style, facial features, expression)
- Room/background: exact layout, furniture, colors, materials, decor items, walls, floor
- Lighting: direction, quality, color temperature
- Composition: where person is positioned, camera angle, framing
- Overall mood and style

Be very specific and precise. This description will be used to recreate the same scene.`,
                },
              ],
            },
          ],
          max_tokens: 1000,
        }),
      });

      if (visionResponse.ok) {
        const visionData = await visionResponse.json();
        detailedDescription = visionData.choices?.[0]?.message?.content || imageContent;
      }
    }

    // STEP 2: Generate improved image based on the EXACT description
    // Only allow minimal aesthetic improvements - NO changes to person or room
    const enhancementPrompt = `Recreate this exact scene with only professional lighting and color improvements:

SCENE TO RECREATE EXACTLY:
${detailedDescription}

STRICT RULES - DO NOT CHANGE:
- Same person with identical appearance, clothing, hairstyle, and face
- Same room layout, furniture, and decor
- Same composition and camera angle
- Same background elements

ONLY THESE MINIMAL IMPROVEMENTS ALLOWED:
- Better professional lighting (softer, more flattering)
- Slightly improved contrast and color grading
- Cleaner, more polished overall look
- If person looks neutral/serious: subtle natural smile only

Platform: ${platform} | Category: ${category}

This must look like the same photo, just professionally lit and color graded.`;

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
