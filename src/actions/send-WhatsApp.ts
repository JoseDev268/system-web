import axios from 'axios';

const token = process.env.META_ACCESS_TOKEN!;
const phoneNumberId = process.env.META_PHONE_NUMBER_ID!;
const apiUrl = process.env.META_API_URL!;

export const sendWhatsAppTextMessage = async (to: string, message: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error sending WhatsApp text message:', error.response?.data || error);
    throw error;
  }
};