// src/app/api/dialogflow/route.ts
import { NextResponse } from 'next/server';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuid } from 'uuid';
import { searchFAQ } from '@/lib/searchFAQ';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const faqAnswer = searchFAQ(message);

    // Si la respuesta está en el FAQ, la devuelve directamente
    if (faqAnswer) {
      return NextResponse.json({ reply: faqAnswer });
    }

    // Si no, llama a Dialogflow
    const sessionId = uuid();
    const client = new SessionsClient();
    const sessionPath = client.projectAgentSessionPath(
      process.env.DIALOGFLOW_PROJECT_ID!,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'es',
        },
      },
    };

    const responses = await client.detectIntent(request);
    const result = responses[0].queryResult;

    const reply = result?.fulfillmentText ?? 'No entendí tu mensaje.';
    return NextResponse.json({ reply });

  } catch (err) {
    console.error('Dialogflow error:', err);
    return NextResponse.json(
      { error: 'Ocurrió un error procesando el mensaje' },
      { status: 500 }
    );
  }
}