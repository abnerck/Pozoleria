import { FormEvent, useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../data/menuData';
import { ResilientImage } from './ResilientImage';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
}

interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  mode: 'pickup' | 'delivery';
  address?: string;
  total: number;
  eta: string;
}

export function OrderDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: OrderDrawerProps) {
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');
  const [tipRate, setTipRate] = useState<number>(0.1);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta'>('tarjeta');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryMode === 'delivery' && items.length > 0 ? 35 : 0;
  const tipAmount = Math.round(subtotal * tipRate);
  const grandTotal = subtotal + deliveryFee + tipAmount;

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = customerName.trim();
    const digitsPhone = phone.replace(/\D/g, '');

    if (cleanName.length < 3) {
      setErrorMsg('Por favor ingresa tu nombre completo para preparar tu orden.');
      return;
    }
    if (digitsPhone.length < 10) {
      setErrorMsg('Ingresa un teléfono a 10 dígitos de Guadalajara para confirmar.');
      return;
    }
    if (deliveryMode === 'delivery' && address.trim().length < 8) {
      setErrorMsg('Escribe calle, número y colonia para el envío en Zona Metropolitana.');
      return;
    }

    const code = `EP-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrder({
      orderNumber: code,
      customerName: cleanName,
      mode: deliveryMode,
      address: deliveryMode === 'delivery' ? address.trim() : undefined,
      total: grandTotal,
      eta: deliveryMode === 'pickup' ? '20–25 min' : '35–45 min',
    });
    onClearCart();
  };

  const resetAndClose = () => {
    setConfirmedOrder(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) resetAndClose();
      }}
    >
      <div className="w-full max-w-md bg-[#FAF9F7] h-full flex flex-col border-l border-[#E6E3DC] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E6E3DC]">
          <div>
            <h2 id="drawer-title" className="font-display text-xl font-semibold text-[#171514]">
              Tu Pedido
            </h2>
            <p className="text-xs text-[#6B6560]">
              Sucursal Barrio de Mexicaltzingo, Guadalajara
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Cerrar pedido"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#E6E3DC] bg-white text-[#171514] hover:bg-[#F1EFEA] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {confirmedOrder ? (
            <div className="bg-white border border-[#E6E3DC] rounded-xl p-6 space-y-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#1E6B43] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-[#1E6B43]">Pedido confirmado</p>
                  <h3 className="font-display text-xl font-semibold text-[#171514] mt-0.5 tabular-nums">
                    Orden {confirmedOrder.orderNumber}
                  </h3>
                </div>
              </div>

              <div className="border-t border-b border-[#E6E3DC] py-4 space-y-2 text-sm text-[#3F3A36]">
                <div className="flex justify-between gap-4">
                  <span className="text-[#6B6560]">A nombre de</span>
                  <span className="font-medium text-[#171514] text-right">
                    {confirmedOrder.customerName}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6B6560]">Modalidad</span>
                  <span className="font-medium text-[#171514] text-right">
                    {confirmedOrder.mode === 'pickup'
                      ? 'Recoger en Nicolás Regules 412'
                      : 'Envío a domicilio ZMG'}
                  </span>
                </div>
                {confirmedOrder.address && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[#6B6560]">Dirección</span>
                    <span className="font-medium text-[#171514] text-right">
                      {confirmedOrder.address}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-[#6B6560]">Tiempo estimado</span>
                  <span className="font-semibold text-[#171514] tabular-nums">
                    {confirmedOrder.eta}
                  </span>
                </div>
                <div className="flex justify-between gap-4 pt-2 border-t border-[#EFECE6]">
                  <span className="font-semibold text-[#171514]">Total a liquidar</span>
                  <span className="font-semibold text-[#9A1F18] tabular-nums">
                    ${confirmedOrder.total} MXN
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6B6560] leading-relaxed">
                Empacamos tu caldo hirviendo aparte del maíz, la verdura y las tostadas para que llegue con la textura exacta de mesa.
              </p>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-3 px-4 bg-[#171514] hover:bg-[#2B2826] text-white text-sm font-semibold rounded-lg transition-colors min-h-[44px]"
              >
                Volver al Menú
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#6B6560]">
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-display text-lg font-semibold text-[#171514]">
                  Tu cazuela aún está vacía
                </h3>
                <p className="text-sm text-[#6B6560]">
                  Elige un pozole jalisciense, unas tostadas de pata o una jericalla del menú para iniciar tu orden.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#9A1F18] hover:bg-[#821812] text-white text-sm font-semibold rounded-lg transition-colors min-h-[40px]"
              >
                Ver el Menú
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFECE6] rounded-lg">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('pickup')}
                  className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    deliveryMode === 'pickup'
                      ? 'bg-white text-[#171514] shadow-sm'
                      : 'text-[#6B6560] hover:text-[#171514]'
                  }`}
                >
                  Recoger en Local
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('delivery')}
                  className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    deliveryMode === 'delivery'
                      ? 'bg-white text-[#171514] shadow-sm'
                      : 'text-[#6B6560] hover:text-[#171514]'
                  }`}
                >
                  Envío ZMG (+$35)
                </button>
              </div>

              <ul className="space-y-4" aria-label="Platillos en tu pedido">
                {items.map((item) => (
                  <li
                    key={item.cartId}
                    className="bg-white border border-[#E6E3DC] rounded-xl p-4 flex gap-3.5"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#EFECE6] shrink-0">
                      <ResilientImage src={item.image} alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#171514] leading-snug">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartId)}
                          aria-label={`Eliminar ${item.name}`}
                          className="text-[#8E877E] hover:text-[#9A1F18] p-1 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      {item.customization && (
                        <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">
                          {item.customization.sizeLabel} · {item.customization.proteinLabel} ·{' '}
                          {item.customization.greensLabel}
                          {item.customization.extras.length > 0 &&
                            ` · Extras: ${item.customization.extras.join(', ')}`}
                          {item.customization.notes && ` · Nota: "${item.customization.notes}"`}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-[#E6E3DC] rounded-lg">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartId, -1)}
                            aria-label="Restar uno"
                            className="w-8 h-8 flex items-center justify-center text-[#171514] hover:bg-[#F5F3EE] rounded-l-lg"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartId, 1)}
                            aria-label="Sumar uno"
                            className="w-8 h-8 flex items-center justify-center text-[#171514] hover:bg-[#F5F3EE] rounded-r-lg"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-[#171514] tabular-nums">
                          ${item.unitPrice * item.quantity} MXN
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#171514]">
                  Propina para cocina y reparto
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { rate: 0, label: '0%' },
                    { rate: 0.1, label: '10%' },
                    { rate: 0.15, label: '15%' },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setTipRate(option.rate)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-colors tabular-nums ${
                        tipRate === option.rate
                          ? 'bg-[#171514] text-white border-[#171514]'
                          : 'bg-white text-[#171514] border-[#E6E3DC] hover:border-[#B9B3A8]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#E6E3DC] rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#6B6560]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${subtotal} MXN</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[#6B6560]">
                    <span>Envío Guadalajara / Zapopan</span>
                    <span className="tabular-nums">${deliveryFee} MXN</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B6560]">
                  <span>Propina</span>
                  <span className="tabular-nums">${tipAmount} MXN</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#EFECE6] font-semibold text-[#171514]">
                  <span>Total</span>
                  <span className="tabular-nums text-base">${grandTotal} MXN</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4 pb-4" noValidate>
                <h3 className="text-sm font-semibold text-[#171514]">
                  Datos para entregar tu pedido
                </h3>

                <div className="space-y-1.5">
                  <label htmlFor="order-name" className="block text-xs font-medium text-[#3F3A36]">
                    Nombre completo
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Andrea Morales"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6E3DC] rounded-lg text-[#171514] focus:outline-none focus:border-[#9A1F18]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="order-phone" className="block text-xs font-medium text-[#3F3A36]">
                    Teléfono (10 dígitos)
                  </label>
                  <input
                    id="order-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="33 1234 5678"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6E3DC] rounded-lg text-[#171514] tabular-nums focus:outline-none focus:border-[#9A1F18]"
                  />
                </div>

                {deliveryMode === 'delivery' && (
                  <div className="space-y-1.5">
                    <label htmlFor="order-address" className="block text-xs font-medium text-[#3F3A36]">
                      Calle, número y colonia (ZMG)
                    </label>
                    <input
                      id="order-address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Av. Vallarta 1480, Col. Americana"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6E3DC] rounded-lg text-[#171514] focus:outline-none focus:border-[#9A1F18]"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-[#3F3A36]">
                    Forma de pago al recibir
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('tarjeta')}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                        paymentMethod === 'tarjeta'
                          ? 'bg-[#171514] text-white border-[#171514]'
                          : 'bg-white text-[#171514] border-[#E6E3DC]'
                      }`}
                    >
                      Terminal / Tarjeta
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('efectivo')}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                        paymentMethod === 'efectivo'
                          ? 'bg-[#171514] text-white border-[#171514]'
                          : 'bg-white text-[#171514] border-[#E6E3DC]'
                      }`}
                    >
                      Efectivo MXN
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-medium text-[#9A1F18] bg-[#FDF2F2] border border-[#F2CBC8] rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 bg-[#9A1F18] hover:bg-[#821812] text-white text-sm font-semibold rounded-lg transition-colors min-h-[44px]"
                >
                  Confirmar Pedido · ${grandTotal} MXN
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
