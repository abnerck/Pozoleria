import { FormEvent, useState } from 'react';
import { Check, Copy, CheckCircle2 } from 'lucide-react';

interface ReservationReceipt {
  folio: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  zone: string;
}

const TIME_SLOTS = ['13:30', '15:00', '16:30', '18:30', '20:00', '21:15'];
const ZONES = ['Patio con fuente', 'Salón tradicional', 'Portal a la calle'];

export function ReservationSection() {
  const [copied, setCopied] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('15:00');
  const [guests, setGuests] = useState(4);
  const [zone, setZone] = useState(ZONES[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [receipt, setReceipt] = useState<ReservationReceipt | null>(null);

  const addressText = 'Calle Nicolás Regules 412, Barrio de Mexicaltzingo, Guadalajara, Jal.';

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(addressText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = name.trim();
    const digitsPhone = phone.replace(/\D/g, '');

    if (cleanName.length < 3) {
      setErrorMsg('Por favor anota el nombre completo de quien reserva.');
      return;
    }
    if (digitsPhone.length < 10) {
      setErrorMsg('Ingresa un número celular a 10 dígitos para enviarte confirmación.');
      return;
    }
    if (!date) {
      setErrorMsg('Selecciona una fecha disponible (martes a domingo).');
      return;
    }

    const selectedDate = new Date(`${date}T12:00:00`);
    if (selectedDate.getDay() === 1) {
      setErrorMsg('Los lunes descansamos para curar ollas y descansar el fogón. Elige de martes a domingo.');
      return;
    }

    setReceipt({
      folio: `MESA-${Math.floor(100 + Math.random() * 899)}`,
      name: cleanName,
      date,
      time,
      guests,
      zone,
    });
  };

  return (
    <section
      id="ubicacion"
      className="py-20 sm:py-24 border-t border-[#E6E3DC] bg-white"
      aria-labelledby="ubicacion-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-medium text-[#9A1F18]">
                Barrio de Mexicaltzingo · Guadalajara
              </p>
              <h2
                id="ubicacion-heading"
                className="font-display text-3xl sm:text-4xl font-semibold text-[#171514] tracking-tight text-balance"
              >
                Tu mesa te espera en la casona
              </h2>
              <p className="text-base text-[#57514C] leading-relaxed">
                A tres cuadras del Templo de Mexicaltzingo y a cinco minutos del Centro Histórico. Casona con patio arbolado, fuente de cantera y estacionamiento para clientes.
              </p>
            </div>

            <div className="border-t border-[#E6E3DC] pt-6 space-y-5 text-sm">
              <div>
                <div className="text-xs text-[#6B6560]">Dirección</div>
                <p className="font-medium text-[#171514] mt-1">{addressText}</p>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#171514] bg-[#F9F8F6] hover:bg-[#EFECE6] border border-[#E6E3DC] rounded-lg transition-colors min-h-[40px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1E6B43]" aria-hidden="true" />
                      <span>Dirección copiada</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copiar dirección</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2 border-t border-[#EFECE6]">
                <div>
                  <div className="text-xs text-[#6B6560]">Horario</div>
                  <p className="font-medium text-[#171514] mt-1">Martes a Domingo</p>
                  <p className="text-[#57514C] tabular-nums mt-0.5">13:00 – 22:30 hrs</p>
                </div>
                <div>
                  <div className="text-xs text-[#6B6560]">Teléfono directo</div>
                  <p className="font-medium text-[#171514] tabular-nums mt-1">(33) 3614-8920</p>
                  <p className="text-[#57514C] mt-0.5">Lunes cerrado</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EFECE6]">
                <div className="text-xs text-[#6B6560]">Referencias cercanas</div>
                <p className="text-[#3F3A36] mt-1 leading-relaxed">
                  Estación Mexicaltzingo Tren Ligero Línea 1 (4 min caminando) · Mercado de Mexicaltzingo · Av. Niños Héroes.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#F9F8F6] border border-[#E6E3DC] rounded-xl p-6 sm:p-8">
            {receipt ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#1E6B43] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium text-[#1E6B43]">Reservación confirmada</p>
                    <h3 className="font-display text-2xl font-semibold text-[#171514] mt-0.5 tabular-nums">
                      Folio {receipt.folio}
                    </h3>
                  </div>
                </div>

                <div className="bg-white border border-[#E6E3DC] rounded-lg p-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-[#6B6560]">Titular</div>
                    <div className="font-semibold text-[#171514] mt-0.5">{receipt.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6B6560]">Comensales</div>
                    <div className="font-semibold text-[#171514] mt-0.5 tabular-nums">
                      {receipt.guests} personas
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6B6560]">Fecha y hora</div>
                    <div className="font-semibold text-[#171514] mt-0.5 tabular-nums">
                      {receipt.date} · {receipt.time} hrs
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6B6560]">Área asignada</div>
                    <div className="font-semibold text-[#171514] mt-0.5">{receipt.zone}</div>
                  </div>
                </div>

                <p className="text-xs text-[#6B6560] leading-relaxed">
                  Guardamos tu mesa por 15 minutos de tolerancia. Si vienes en fin de semana y necesitas lugar para carriola o silla de ruedas, ya quedó contemplado en planta baja.
                </p>

                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="px-5 py-2.5 bg-white hover:bg-[#EFECE6] text-[#171514] border border-[#E6E3DC] text-sm font-semibold rounded-lg transition-colors min-h-[40px]"
                >
                  Hacer otra reservación
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-semibold text-[#171514]">
                    Reservar Mesa
                  </h3>
                  <p className="text-sm text-[#57514C]">
                    Aparta sin filas para comida familiar, viernes de pozole o domingo tapatío.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="res-name" className="block text-xs font-semibold text-[#171514]">
                      Nombre completo
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Carlos Lomelí"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6E3DC] rounded-lg text-[#171514] focus:outline-none focus:border-[#9A1F18]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="res-phone" className="block text-xs font-semibold text-[#171514]">
                      Teléfono celular
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="33 2345 6789"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6E3DC] rounded-lg text-[#171514] tabular-nums focus:outline-none focus:border-[#9A1F18]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="res-date" className="block text-xs font-semibold text-[#171514]">
                      Fecha (Mar – Dom)
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      min={today}
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6E3DC] rounded-lg text-[#171514] tabular-nums focus:outline-none focus:border-[#9A1F18]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="res-guests" className="block text-xs font-semibold text-[#171514]">
                      Número de personas
                    </label>
                    <select
                      id="res-guests"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6E3DC] rounded-lg text-[#171514] tabular-nums focus:outline-none focus:border-[#9A1F18]"
                    >
                      {[2, 3, 4, 5, 6, 8, 10, 12].map((count) => (
                        <option key={count} value={count}>
                          {count} personas
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-[#171514]">
                    Horario disponible
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-colors tabular-nums whitespace-nowrap min-h-[40px] ${
                          time === slot
                            ? 'bg-[#171514] text-white border-[#171514]'
                            : 'bg-white text-[#171514] border-[#E6E3DC] hover:border-[#B9B3A8]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-[#171514]">
                    Zona preferida
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {ZONES.map((z) => (
                      <button
                        key={z}
                        type="button"
                        onClick={() => setZone(z)}
                        className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap min-h-[40px] ${
                          zone === z
                            ? 'bg-[#171514] text-white border-[#171514]'
                            : 'bg-white text-[#171514] border-[#E6E3DC] hover:border-[#B9B3A8]'
                        }`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-medium text-[#9A1F18] bg-[#FDF2F2] border border-[#F2CBC8] rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 bg-[#9A1F18] hover:bg-[#821812] text-white text-sm font-semibold rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
                >
                  Confirmar Mesa en El Pueblito
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
