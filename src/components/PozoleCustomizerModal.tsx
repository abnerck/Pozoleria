import { useEffect, useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import {
  MenuItem,
  POZOLE_SIZES,
  POZOLE_PROTEINS,
  POZOLE_GREENS,
  POZOLE_EXTRAS,
  CartItem,
} from '../data/menuData';
import { ResilientImage } from './ResilientImage';

interface PozoleCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export function PozoleCustomizerModal({
  item,
  onClose,
  onAddToCart,
}: PozoleCustomizerModalProps) {
  const [sizeId, setSizeId] = useState<'chico' | 'mediano' | 'grande'>('mediano');
  const [proteinId, setProteinId] = useState<string>('maciza');
  const [greensId, setGreensId] = useState<string>('col');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (item) {
      setSizeId('mediano');
      setProteinId(item.defaultProtein || 'maciza');
      setGreensId('col');
      setSelectedExtras([]);
      setQuantity(1);
      setNotes('');
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const sizeObj = POZOLE_SIZES.find((s) => s.id === sizeId) ?? POZOLE_SIZES[1];
  const proteinObj =
    POZOLE_PROTEINS.find((p) => p.id === proteinId) ?? POZOLE_PROTEINS[0];
  const greensObj = POZOLE_GREENS.find((g) => g.id === greensId) ?? POZOLE_GREENS[0];

  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const found = POZOLE_EXTRAS.find((e) => e.id === extraId);
    return sum + (found ? found.price : 0);
  }, 0);

  const unitPrice = item.price + sizeObj.priceDelta + proteinObj.priceDelta + extrasTotal;
  const lineTotal = unitPrice * quantity;

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleConfirm = () => {
    const extraLabels = selectedExtras
      .map((id) => POZOLE_EXTRAS.find((e) => e.id === id)?.label)
      .filter((label): label is string => Boolean(label));

    onAddToCart({
      cartId: `${item.id}-${sizeId}-${proteinId}-${greensId}-${selectedExtras.sort().join('_')}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      unitPrice,
      quantity,
      customization: {
        sizeLabel: `${sizeObj.label} (${sizeObj.portion})`,
        proteinLabel: proteinObj.label,
        greensLabel: greensObj.label,
        extras: extraLabels,
        notes: notes.trim() || undefined,
      },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FAF9F7] border border-[#E6E3DC] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#FAF9F7]/95 backdrop-blur-sm border-b border-[#E6E3DC]">
          <div>
            <p className="text-xs text-[#6B6560]">Personalizar plato</p>
            <h3
              id="customizer-title"
              className="font-display text-xl font-semibold text-[#171514]"
            >
              {item.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar personalizador"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#E6E3DC] bg-white text-[#171514] hover:bg-[#F1EFEA] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center pb-6 border-b border-[#E6E3DC]">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#EFECE6]">
              <ResilientImage src={item.image} alt={item.imageAlt} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <p className="text-xs text-[#6B6560]">{item.meta}</p>
              <p className="text-sm text-[#3F3A36] leading-relaxed">{item.description}</p>
              <p className="text-sm font-semibold text-[#171514] tabular-nums">
                Base mediana: ${item.price} MXN
              </p>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-[#171514]">
              1. Tamaño de cazuela
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {POZOLE_SIZES.map((size) => {
                const active = sizeId === size.id;
                const priceDisplay = item.price + size.priceDelta;
                return (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setSizeId(size.id)}
                    className={`px-3 py-3 text-left rounded-lg border transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18] ${
                      active
                        ? 'bg-[#171514] text-white border-[#171514]'
                        : 'bg-white text-[#171514] border-[#E6E3DC] hover:border-[#B9B3A8]'
                    }`}
                  >
                    <div className="text-sm font-semibold whitespace-nowrap">{size.label}</div>
                    <div
                      className={`text-xs mt-0.5 tabular-nums ${
                        active ? 'text-[#D6D2CA]' : 'text-[#6B6560]'
                      }`}
                    >
                      {size.portion} · ${priceDisplay}
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-[#171514]">
              2. Elige la proteína
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POZOLE_PROTEINS.map((protein) => {
                const active = proteinId === protein.id;
                return (
                  <button
                    key={protein.id}
                    type="button"
                    onClick={() => setProteinId(protein.id)}
                    className={`px-4 py-3 text-left rounded-lg border transition-colors min-h-[44px] flex items-center justify-between gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18] ${
                      active
                        ? 'bg-[#171514] text-white border-[#171514]'
                        : 'bg-white text-[#171514] border-[#E6E3DC] hover:border-[#B9B3A8]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{protein.label}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          active ? 'text-[#D6D2CA]' : 'text-[#6B6560]'
                        }`}
                      >
                        {protein.detail}
                      </div>
                    </div>
                    {protein.priceDelta > 0 && (
                      <span
                        className={`text-xs font-medium tabular-nums whitespace-nowrap shrink-0 ${
                          active ? 'text-[#F5D0CD]' : 'text-[#9A1F18]'
                        }`}
                      >
                        +${protein.priceDelta}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-[#171514]">
              3. Verdura fresca incluida
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {POZOLE_GREENS.map((green) => {
                const active = greensId === green.id;
                return (
                  <button
                    key={green.id}
                    type="button"
                    onClick={() => setGreensId(green.id)}
                    className={`px-3 py-2.5 text-left text-xs font-medium rounded-lg border transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18] ${
                      active
                        ? 'bg-[#171514] text-white border-[#171514]'
                        : 'bg-white text-[#171514] border-[#E6E3DC] hover:border-[#B9B3A8]'
                    }`}
                  >
                    {green.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#6B6560]">
              Incluye rábanos, cebolla picada, limón colima, orégano de cerro, tostadas y chile de árbol aparte.
            </p>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-[#171514]">
              4. Complementos extra (opcional)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POZOLE_EXTRAS.map((extra) => {
                const checked = selectedExtras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => toggleExtra(extra.id)}
                    aria-pressed={checked}
                    className={`px-4 py-3 rounded-lg border transition-colors min-h-[44px] flex items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18] ${
                      checked
                        ? 'bg-white border-[#9A1F18] text-[#171514]'
                        : 'bg-white border-[#E6E3DC] text-[#171514] hover:border-[#B9B3A8]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-sm font-medium">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                          checked
                            ? 'bg-[#9A1F18] border-[#9A1F18] text-white'
                            : 'border-[#C9C3B8] bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" aria-hidden="true" />}
                      </span>
                      {extra.label}
                    </span>
                    <span className="text-xs font-semibold text-[#6B6560] tabular-nums whitespace-nowrap shrink-0">
                      +${extra.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="pozole-notes" className="block text-sm font-semibold text-[#171514]">
              Indicaciones para cocina
            </label>
            <input
              id="pozole-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Sin cebolla, poco grano, caldo bien caliente..."
              maxLength={120}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6E3DC] rounded-lg text-[#171514] placeholder:text-[#8E877E] focus:outline-none focus:border-[#9A1F18]"
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-6 py-4 bg-white border-t border-[#E6E3DC]">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="inline-flex items-center border border-[#E6E3DC] rounded-lg bg-[#FAF9F7]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Reducir cantidad"
                className="w-10 h-10 flex items-center justify-center text-[#171514] hover:bg-[#EFECE6] rounded-l-lg transition-colors"
              >
                <Minus className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="w-10 text-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(12, q + 1))}
                aria-label="Aumentar cantidad"
                className="w-10 h-10 flex items-center justify-center text-[#171514] hover:bg-[#EFECE6] rounded-r-lg transition-colors"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div>
              <div className="text-xs text-[#6B6560]">Total del plato</div>
              <div className="text-lg font-semibold text-[#171514] tabular-nums">
                ${lineTotal} MXN
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-3 bg-[#9A1F18] hover:bg-[#821812] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
          >
            Agregar al Pedido · ${lineTotal} MXN
          </button>
        </div>
      </div>
    </div>
  );
}
