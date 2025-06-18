export const sendWhatsAppTemplateMessage = async (to: string) => {
  const url = `https://graph.facebook.com/v20.0/${process.env.META_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: 'hello_world', // plantilla de prueba
      language: { code: 'en_US' },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('Error al enviar mensaje:', await res.text());
    throw new Error('No se pudo enviar el mensaje de WhatsApp');
  }

  return res.json();
};