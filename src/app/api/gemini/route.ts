import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDYRLOwNHqXGMgy-HobYgm7prZeh8k9W5s";
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const geminiRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: message }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,   // <--- send key here
        },
      }
    );

    const responseText =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to get response from Gemini' }, { status: 500 });
  }
}
