// // src/app/api/dialogflow/route.ts
// import { NextResponse } from 'next/server';
// import { SessionsClient } from '@google-cloud/dialogflow';
// import { v4 as uuid } from 'uuid';
// import { searchFAQ } from '@/lib/searchFAQ';

// export async function POST(req: Request) {
//   try {
//     const { message } = await req.json();
//     const faqAnswer = searchFAQ(message);

//     // Si la respuesta está en el FAQ, la devuelve directamente
//     if (faqAnswer) {
//       return NextResponse.json({ reply: faqAnswer });
//     }

//     // Si no, llama a Dialogflow
//     const sessionId = uuid();
//     const client = new SessionsClient();
//     const sessionPath = client.projectAgentSessionPath(
//       process.env.DIALOGFLOW_PROJECT_ID!,
//       sessionId
//     );

//     const request = {
//       session: sessionPath,
//       queryInput: {
//         text: {
//           text: message,
//           languageCode: 'es',
//         },
//       },
//     };

//     const responses = await client.detectIntent(request);
//     const result = responses[0].queryResult;

//     const reply = result?.fulfillmentText ?? 'No entendí tu mensaje.';
//     return NextResponse.json({ reply });

//   } catch (err) {
//     console.error('Dialogflow error:', err);
//     return NextResponse.json(
//       { error: 'Ocurrió un error procesando el mensaje' },
//       { status: 500 }
//     );
//   }
// }

import { type NextRequest, NextResponse } from "next/server"

// Simulación de respuestas de Dialogflow para demostración
// En producción, aquí harías la llamada real a la API de Dialogflow
const simulateDialogflowResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  if (lowerMessage.includes("lugares turísticos") || lowerMessage.includes("qué hacer en copacabana") || lowerMessage.includes("atracciones")) {
    return "En Copacabana, puedes visitar la Basílica de la Virgen de la Candelaria, el Cerro Calvario, y la Isla del Sol. También hay tours en bote por el Lago Titicaca y caminatas a sitios arqueológicos como la Horca del Inca. ¿Quieres más detalles sobre alguno?";
  }
  if (lowerMessage.includes("isla del sol") || lowerMessage.includes("actividades isla del sol")) {
    return "En la Isla del Sol puedes hacer caminatas por senderos incas, visitar ruinas como el Palacio Pilkokaina y la Fuente Sagrada, y disfrutar de vistas al Lago Titicaca. Los tours salen a las 8:00 AM desde Copacabana. ¿Te interesa un tour de un día?";
  }
  if (lowerMessage.includes("isla de la luna") || lowerMessage.includes("llegar isla de la luna")) {
    return "La Isla de la Luna se visita en bote, normalmente combinada con la Isla del Sol. Tiene ruinas como el Templo Inak Uyu. Los tours desde Copacabana duran 6-8 horas. ¿Quieres más información sobre los tours?";
  }
  if (lowerMessage.includes("cerro calvario") || lowerMessage.includes("importancia cerro calvario")) {
    return "El Cerro Calvario es un sitio de peregrinación con 14 estaciones del Vía Crucis y vistas espectaculares del Lago Titicaca, ideal al atardecer. También se realizan rituales andinos. ¿Planeas visitarlo?";
  }
  if (lowerMessage.includes("museos") || lowerMessage.includes("museo copacabana")) {
    return "Puedes visitar el Museo del Poncho en la calle Tito Yupanqui, con textiles andinos, y el Museo de Historia Andina en la calle Jáuregui, sobre el Lago Titicaca. Ambos están abiertos de 8:00 AM a 6:00 PM. ¿Te interesa alguno?";
  }
  if (lowerMessage.includes("actividades al aire libre") || lowerMessage.includes("qué hacer afuera")) {
    return "En Copacabana puedes hacer paseos en bote, kayak en la bahía, caminatas al Asiento del Inca, ciclismo rural, y observar rituales a la Pachamama en el Cerro Calvario. ¿Cuál te llama la atención?";
  }
  if (lowerMessage.includes("gastronomía") || lowerMessage.includes("dónde comer") || lowerMessage.includes("comida típica")) {
    return "Prueba la trucha del lago en restaurantes de la Avenida 6 de Agosto, como Pueblo Viejo. El Mercado 2 de Febrero ofrece desayunos y platos típicos. ¿Buscas algo en particular?";
  }
  if (lowerMessage.includes("festividades") || lowerMessage.includes("eventos culturales") || lowerMessage.includes("fiestas")) {
    return "La Fiesta de la Virgen de la Candelaria en febrero es la más importante, con danzas y peregrinaciones. También destacan Semana Santa y el Día de la Virgen. ¿Quieres saber sobre algún evento específico?";
  }
  if (lowerMessage.includes("caminatas largas") || lowerMessage.includes("trekking copacabana")) {
    return "Una caminata popular es la ruta de 18 km a Yampupata, pasando por pueblos y ruinas. Desde Yampupata, puedes tomar un bote a la Isla del Sol. ¿Te interesa esta ruta?";
  }
  if (lowerMessage.includes("compras") || lowerMessage.includes("souvenirs") || lowerMessage.includes("artesanías")) {
    return "En el Mercado 2 de Febrero y las calles Pando y Jáuregui encontrarás artesanías, ponchos y ofrendas para la Pachamama. La librería Spitting Llama tiene libros y equipo. ¿Qué buscas comprar?";
  }
  if (lowerMessage.includes("llegar copacabana") || lowerMessage.includes("cómo llegar desde la paz")) {
    return "Desde La Paz, toma un autobús en la terminal cerca del Cementerio con empresas como Manco Kapac. El viaje dura 3.5 horas y cuesta 5-10 USD. ¿Necesitas horarios específicos?";
  }
  if (lowerMessage.includes("mejor época") || lowerMessage.includes("cuándo visitar")) {
    return "La mejor época es de mayo a octubre, con clima seco y fresco, ideal para actividades al aire libre. Lleva ropa abrigada para las noches frías. ¿Cuándo planeas viajar?";
  }
  if (lowerMessage.includes("altitud") || lowerMessage.includes("mal de altura")) {
    return "Copacabana está a 3,800 msnm, así que el mal de altura es común. Bebe mate de coca, camina despacio y usa protector solar por el sol intenso. ¿Necesitas más consejos?";
  }
  if (lowerMessage.includes("cajeros") || lowerMessage.includes("tarjetas") || lowerMessage.includes("pago")) {
    return "Hay pocos cajeros en Copacabana, y no todos los negocios aceptan tarjetas. Lleva efectivo en bolivianos. La tarjeta N26 es útil para retiros sin comisiones. ¿Algo más sobre pagos?";
  }
  if (lowerMessage.includes("alojamiento") || lowerMessage.includes("dónde quedarse") || lowerMessage.includes("hoteles")) {
    return "Hay hostales como Skylake (20-30 USD) y hoteles como La Cúpula con vistas al lago. Reserva con antelación en temporada alta. ¿Buscas algo económico o con vistas?";
  }
  if (lowerMessage.includes("sitios arqueológicos") || lowerMessage.includes("ruinas cerca")) {
    return "Además de la Horca del Inca, está el Baño del Inca con aguas termales y Sahuiña con ruinas menos visitadas. Consulta con guías locales para acceder. ¿Cuál te interesa?";
  }
  if (lowerMessage.includes("lado peruano") || lowerMessage.includes("puno") || lowerMessage.includes("islas uros")) {
    return "Puno, en Perú, está a 2.5 horas en autobús desde Copacabana, con trámite en la frontera. Hay tours a las Islas Uros y Taquile desde Puno. ¿Quieres un tour combinado?";
  }
  if (lowerMessage.includes("senderismo") || lowerMessage.includes("rutas cerca")) {
    return "Además de Yampupata, hay senderos a Kesanani, donde está la Horca del Inca, y a la Iglesia de Colquepata, con vistas al lago. ¿Prefieres algo corto o largo?";
  }
  if (lowerMessage.includes("seguridad") || lowerMessage.includes("es seguro")) {
    return "Copacabana es un destino turístico seguro, pero evita caminar solo de noche y cuida tus pertenencias en mercados concurridos. ¿Más consejos de seguridad?";
  }
  if (lowerMessage.includes("tours combinados") || lowerMessage.includes("excursiones")) {
    return "Hay tours de un día a Tiwanaku y el Lago Titicaca desde La Paz, o paquetes de 2 días a la Isla del Sol con guía. Reserva con agencias como Yampu Tours. ¿Qué tour prefieres?";
  }
  if (lowerMessage.includes("hola") || lowerMessage.includes("buenos días") || lowerMessage.includes("buenas tardes")) {
    return "¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte hoy?";
  }
  if (lowerMessage.includes("ayuda") || lowerMessage.includes("ayudar")) {
    return "Estoy aquí para ayudarte. Puedo responder preguntas sobre nuestros servicios, horarios, y más. ¿Qué necesitas saber?";
  }
  if (lowerMessage.includes("horario") || lowerMessage.includes("hora")) {
    return "Nuestros horarios de atención son de lunes a viernes de 9:00 AM a 6:00 PM, y sábados de 9:00 AM a 2:00 PM.";
  }
  if (lowerMessage.includes("contacto") || lowerMessage.includes("teléfono") || lowerMessage.includes("email")) {
    return "Puedes contactarnos por teléfono al (555) 123-4567 o por email a info@empresa.com. También puedes visitarnos en nuestra oficina.";
  }
  if (lowerMessage.includes("precio") || lowerMessage.includes("costo") || lowerMessage.includes("cuánto")) {
    return "Los precios varían según el servicio que necesites. ¿Podrías ser más específico sobre qué servicio te interesa?";
  }
  if (lowerMessage.includes("gracias") || lowerMessage.includes("thank you")) {
    return "¡De nada! ¿Hay algo más en lo que pueda ayudarte?";
  }
  if (lowerMessage.includes("adiós") || lowerMessage.includes("bye") || lowerMessage.includes("hasta luego")) {
    return "¡Hasta luego! Que tengas un excelente día. No dudes en volver si necesitas ayuda.";
  }
  return "Entiendo tu consulta sobre turismo en Copacabana. ¿Podrías dar más detalles para ayudarte mejor?";
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
    }

    // Aquí es donde integrarías con Dialogflow real
    // Por ahora usamos respuestas simuladas

    /*
    // Ejemplo de integración real con Dialogflow:
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: 'path/to/your/service-account-key.json',
    })
    
    const sessionPath = sessionClient.projectAgentSessionPath(
      'your-project-id',
      'unique-session-id'
    )
    
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'es',
        },
      },
    }
    
    const [response] = await sessionClient.detectIntent(request)
    const result = response.queryResult
    */

    // Simulación de delay para hacer más realista
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const response = simulateDialogflowResponse(message)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error en Dialogflow API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
