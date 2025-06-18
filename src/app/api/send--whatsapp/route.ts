import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppTemplateMessage } from '@/lib/WhatsApp';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();
    const result = await sendWhatsAppTemplateMessage(phoneNumber);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 });
  }
}