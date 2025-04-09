import OpenAI from 'openai';

// Log the API key (but mask it for security)
const apiKey = process.env.OPENAI_API_KEY;
console.log('API Key available:', !!apiKey, 'First 4 chars:', apiKey?.slice(0, 4));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(request) {
  console.log('API route called');
  try {
    const { message } = await request.json();
    console.log('Received message:', message);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Creating chat completion...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a product management course."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log('OpenAI response received');
    
    const responseContent = completion.choices[0].message.content;
    console.log('Response content:', responseContent);

    return new Response(JSON.stringify({ 
      response: responseContent 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
    });
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return new Response(JSON.stringify({ 
      error: 'Failed to get response from AI',
      details: error.message,
      type: error.name
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
    });
  }
} 