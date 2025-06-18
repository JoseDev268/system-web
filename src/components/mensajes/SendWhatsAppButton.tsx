'use client';

import { useState } from 'react';

export const SendWhatsAppButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const res = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '+59168991222' }),
    });
    const data = await res.json();
    console.log('Respuesta API:', data);
    setLoading(false);
  };

  return (
    <button onClick={handleSend} disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded">
      {loading ? 'Enviando...' : 'Enviar WhatsApp'}
    </button>
  );
};