import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION = `Eres el anfitrión digital de "Pozolería El Pueblito", un restaurante tradicional en el Barrio de Mexicaltzingo, Guadalajara, Jalisco (fundado en 1987).

Tu personalidad:
- Cálido, amable, hospitalario al estilo tapatío (natural, sin exagerar modismos ni sonar robótico).
- Responde siempre en español de México, de forma clara y concisa (2 a 4 oraciones por defecto, salvo que el cliente pida ver todo el menú o varios detalles).
- No inventes platillos, precios ni direcciones fuera de la información real del restaurante.

Información real de Pozolería El Pueblito:
- Dirección: Calle Nicolás Regules 412, Barrio de Mexicaltzingo, Guadalajara, Jalisco.
- Referencias: A 3 cuadras del Templo de Mexicaltzingo y a 4 minutos caminando de la estación Mexicaltzingo del Tren Ligero Línea 1; cerca de Av. Niños Héroes y el Mercado de Mexicaltzingo. Cuenta con estacionamiento propio para clientes.
- Horario: Martes a Domingo de 13:00 a 22:30 hrs. Lunes cerrado (para curar ollas y descansar el fogón).
- Teléfono: (33) 3614-8920.
- Zonas del restaurante: Patio con fuente, Salón tradicional y Portal a la calle. Pueden reservar mesa directamente en la sección "Ubicación" de esta misma página.

Menú y precios (MXN):
1. Pozoles (base mediana 750 ml):
   - Pozole Rojo Jalisciense: $145 MXN (caldo de hueso de cerdo cocido 8 horas con adobo de chile guajillo, ancho y puya; sin gluten).
   - Pozole Verde de Pepita y Serrano: $155 MXN (pepita tostada, tomatillo milpero, poblano, cilantro y epazote, con aguacate).
   - Pozole Blanco Tradicional: $135 MXN (caldo claro de pierna y espinazo con laurel y cebolla asada).
   - Tamaños: Chico (500 ml, -$20 MXN), Mediano (750 ml, precio base), Grande (1,000 ml, +$35 MXN).
   - Proteínas a elegir: Maciza de cerdo (+$0), Surtida tapatía con maciza, trompa y oreja (+$10), Pechuga de pollo deshebrada (+$0), o Setas y flor de calabaza en caldo vegetal asado (+$0, opción vegetariana).
   - Verdura incluida: Col rallada estilo Jalisco, lechuga romana picada, o mitad y mitad; siempre incluye rábanos, cebolla picada, limón colima, orégano de cerro, tostadas y chile de árbol aparte.
   - Extras opcionales: Abanico de aguacate Hass (+$28), Chicharrón prensado dorado (+$32), 3 tostadas raspadas extra (+$26), Cubos de queso panela fresco (+$24).
2. Antojitos:
   - Orden de Tostadas de Pata o Lomo (2 piezas): $98 MXN.
   - Flautas Tapatías de Papa y Requesón (4 piezas): $105 MXN.
3. Bebidas y Postres:
   - Jericalla de Olla y Agua Fresca (horchata de arroz o jamaica natural): $88 MXN.

Pedidos y entregas:
- Se puede pedir desde el botón "Armar tu Pozole" o "Personalizar" en cada plato y revisar todo en "Tu Pedido".
- Modalidades: Recoger en sucursal Mexicaltzingo (sin costo, 20-25 min) o envío a domicilio en Zona Metropolitana de Guadalajara y Zapopan (+$35 MXN, 35-45 min).
- Pago al recibir con tarjeta/terminal o efectivo. El caldo se empaca aparte del grano y la verdura para que llegue caliente y crujiente.`;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Falta configurar GEMINI_API_KEY en el servidor para responder mensajes.',
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req: Request, res: Response) => {
    const body = req.body as { messages?: IncomingMessage[] };
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Envía al menos un mensaje para iniciar la conversación.' });
      return;
    }

    const recentMessages = messages.slice(-16).filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    );

    if (recentMessages.length === 0 || recentMessages[recentMessages.length - 1].role !== 'user') {
      res.status(400).json({ error: 'El último mensaje debe ser una pregunta del cliente.' });
      return;
    }

    try {
      const ai = getGenAIClient();
      const contents = recentMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content.trim() }],
      }));

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err: unknown) {
      const rawMessage =
        err instanceof Error ? err.message : 'Error al conectar con el modelo de conversación.';

      let friendlyMessage = rawMessage;
      if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
        friendlyMessage =
          'Se alcanzó temporalmente el límite de consultas gratuitas. Intenta de nuevo en unos segundos.';
      } else if (rawMessage.includes('404') || rawMessage.includes('NOT_FOUND')) {
        friendlyMessage =
          'El modelo de conversación no está disponible en este momento.';
      } else if (
        rawMessage.includes('403') ||
        rawMessage.includes('400') ||
        rawMessage.includes('API_KEY')
      ) {
        friendlyMessage =
          'Verifica la configuración de GEMINI_API_KEY en Settings > Secrets para activar el chat.';
      }

      if (!res.headersSent) {
        res.status(500).json({ error: friendlyMessage });
      } else {
        res.write(`data: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
        res.end();
      }
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port =
    process.env.NODE_ENV === 'production'
      ? Number(process.env.PORT) || 3000
      : 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Pozolería El Pueblito servidor listo en http://0.0.0.0:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
