import { FormEvent, useEffect, useRef, useState } from 'react';
import { MessageCircle, RotateCcw, Send, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    '¡Hola! Soy el anfitrión de Pozolería El Pueblito en Guadalajara. Pregúntame sobre nuestros pozoles, tamaños, opciones vegetarianas, envíos o cómo llegar al Barrio de Mexicaltzingo.',
};

const QUICK_PROMPTS = [
  '¿Qué pozole me recomiendas?',
  '¿Tienen opción vegetariana?',
  '¿Cuánto cuesta el envío en GDL?',
  '¿Cómo llego a Mexicaltzingo?',
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };
    const assistantId = `assistant-${Date.now() + 1}`;
    const updatedHistory = [...messages, userMsg];

    setMessages([
      ...updatedHistory,
      { id: assistantId, role: 'assistant', content: '' },
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const payloadMessages = updatedHistory
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || 'No se pudo obtener respuesta del servidor.');
      }

      if (!response.body) {
        throw new Error('La respuesta del servidor llegó vacía.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          const line = event
            .split('\n')
            .find((l) => l.startsWith('data: '));
          if (!line) continue;

          const data = JSON.parse(line.slice(6)) as {
            text?: string;
            done?: boolean;
            error?: string;
          };

          if (data.error) {
            throw new Error(data.error);
          }

          if (data.text) {
            accumulated += data.text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: accumulated } : m,
              ),
            );
          }
        }
      }

      if (!accumulated.trim()) {
        throw new Error('No se recibió texto del modelo. Intenta de nuevo.');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al enviar tu mensaje.';
      setErrorMsg(msg);
      setMessages((prev) =>
        prev.filter((m) => !(m.id === assistantId && m.content === '')),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setErrorMsg(null);
    setInput('');
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir chat con El Pueblito"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 bg-[#171514] hover:bg-[#2C2826] text-white text-sm font-semibold rounded-xl shadow-lg border border-white/10 transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
      >
        <MessageCircle className="w-4 h-4 text-[#E5A39E]" aria-hidden="true" />
        <span>Platicar con El Pueblito</span>
      </button>
    );
  }

  return (
    <section
      role="dialog"
      aria-label="Chat de Pozolería El Pueblito"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[82vh] bg-[#FAF9F7] border border-[#E6E3DC] rounded-xl shadow-2xl flex flex-col overflow-hidden"
    >
      <div className="px-4 py-3.5 bg-[#171514] text-white flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-base font-semibold truncate">
            Anfitrión El Pueblito
          </h2>
          <p className="text-xs text-[#C7C2B9] truncate">
            Dudas sobre menú, horarios y reservas
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reiniciar conversación"
            title="Reiniciar conversación"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#D6D2CA] hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar chat"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#D6D2CA] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3.5"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isStreamingEmpty = !isUser && msg.content === '' && isLoading;

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-[#171514] text-white'
                    : 'bg-white border border-[#E6E3DC] text-[#171514]'
                }`}
              >
                {isStreamingEmpty ? (
                  <span className="text-[#6B6560]">Escribiendo respuesta...</span>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          );
        })}

        {messages.length === 1 && !isLoading && (
          <div className="pt-2 space-y-2">
            <p className="text-xs text-[#6B6560]">Preguntas frecuentes</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="px-3 py-2 text-xs font-medium text-[#171514] bg-white hover:bg-[#EFECE6] border border-[#E6E3DC] rounded-lg text-left transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-[#FDF2F2] border border-[#F2CBC8] rounded-xl p-3 text-xs text-[#9A1F18] space-y-2">
            <p>{errorMsg}</p>
            <button
              type="button"
              onClick={() => {
                const lastUser = [...messages]
                  .reverse()
                  .find((m) => m.role === 'user');
                if (lastUser) {
                  setMessages((prev) => prev.filter((m) => m.id !== lastUser.id));
                  void sendMessage(lastUser.content);
                }
              }}
              className="font-semibold underline underline-offset-2"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-[#E6E3DC] flex items-center gap-2"
      >
        <label htmlFor="chat-input" className="sr-only">
          Escribe tu pregunta para El Pueblito
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre pozoles, precios, horario..."
          disabled={isLoading}
          maxLength={350}
          className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-[#F9F8F6] border border-[#E6E3DC] rounded-lg text-[#171514] placeholder:text-[#8E877E] focus:outline-none focus:border-[#9A1F18] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Enviar mensaje"
          className="w-10 h-10 flex items-center justify-center bg-[#9A1F18] hover:bg-[#821812] disabled:bg-[#CFC9C0] text-white rounded-lg transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
