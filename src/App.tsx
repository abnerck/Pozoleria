import { useState } from 'react';
import { ArrowRight, Check, ShoppingBag } from 'lucide-react';
import {
  CartItem,
  GUADALAJARA_REVIEWS,
  HERO_IMAGE,
  KITCHEN_IMAGE,
  MENU_ITEMS,
  MenuCategory,
  MenuItem,
  TRADITION_PILLARS,
} from './data/menuData';
import { ResilientImage } from './components/ResilientImage';
import { PozoleCustomizerModal } from './components/PozoleCustomizerModal';
import { OrderDrawer } from './components/OrderDrawer';
import { ReservationSection } from './components/ReservationSection';
import { ChatWidget } from './components/ChatWidget';

const CATEGORY_TABS: { id: MenuCategory; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'pozoles', label: 'Pozoles' },
  { id: 'antojitos', label: 'Antojitos' },
  { id: 'bebidas', label: 'Bebidas y Postres' },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('todos');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  const filteredItems =
    activeCategory === 'todos'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showAddedNotice = (itemName: string) => {
    setAddedFeedback(itemName);
    window.setTimeout(() => {
      setAddedFeedback((prev) => (prev === itemName ? null : prev));
    }, 3200);
  };

  const handleAddCustomizedItem = (newItem: CartItem) => {
    setCart((prev) => [...prev, newItem]);
    showAddedNotice(newItem.name);
  };

  const handleQuickAddItem = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (entry) => entry.menuItemId === item.id && !entry.customization,
      );
      if (existing) {
        return prev.map((entry) =>
          entry.cartId === existing.cartId
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }
      return [
        ...prev,
        {
          cartId: `${item.id}-${Date.now()}`,
          menuItemId: item.id,
          name: item.name,
          image: item.image,
          unitPrice: item.price,
          quantity: 1,
        },
      ];
    });
    showAddedNotice(item.name);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const heroFeaturedPozole = MENU_ITEMS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#171514]">
      {/* Top Bar Contract: 3 exact zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#F9F8F6]/95 backdrop-blur-sm border-b border-[#E6E3DC]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#"
            className="font-display text-xl font-bold tracking-tight text-[#171514] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
          >
            El Pueblito
          </a>

          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57514C]"
          >
            <a
              href="#menu"
              className="hover:text-[#171514] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Menú
            </a>
            <a
              href="#tradicion"
              className="hover:text-[#171514] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Tradición
            </a>
            <a
              href="#resenas"
              className="hover:text-[#171514] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Reseñas
            </a>
            <a
              href="#ubicacion"
              className="hover:text-[#171514] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Ubicación
            </a>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#171514] hover:bg-[#2C2826] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Tu Pedido</span>
              {totalItems > 0 && (
                <span className="tabular-nums text-[#F5D0CD]">({totalItems})</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Split */}
        <section className="max-w-6xl mx-auto px-6 pt-10 pb-12 sm:pt-14 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6 py-2">
              <p className="text-xs sm:text-sm font-medium text-[#9A1F18]">
                Guadalajara, Jalisco · Barrio de Mexicaltzingo
              </p>

              <h1
                className="font-display font-semibold text-[#171514] tracking-tight leading-[1.08] text-balance"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.65rem)' }}
              >
                Maíz cacahuazintle, caldo de ocho horas y sabor de barrio.
              </h1>

              <p className="text-base text-[#57514C] leading-relaxed max-w-xl">
                Desde 1987 servimos pozole rojo jalisciense en cazuela de barro, tostadas raspadas de pata y jericalla horneada en nuestra casona de Nicolás Regules.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomizingItem(heroFeaturedPozole)}
                  className="px-6 py-3.5 bg-[#9A1F18] hover:bg-[#821812] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
                >
                  Armar tu Pozole
                </button>
                <a
                  href="#ubicacion"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#171514] hover:text-[#9A1F18] transition-colors whitespace-nowrap shrink-0 py-2"
                >
                  <span>Reservar mesa</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[16/10] lg:aspect-auto lg:h-full min-h-[320px] rounded-xl overflow-hidden bg-[#171514] border border-[#E6E3DC]">
                <ResilientImage
                  src={HERO_IMAGE.src}
                  alt={HERO_IMAGE.alt}
                  className="w-full h-full object-cover"
                  aspectClassName="aspect-[16/10] lg:h-full"
                />
              </div>
            </div>
          </div>

          {/* 4-column strip directly below hero split */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 border-t border-b border-[#E6E3DC] divide-y sm:divide-y-0 sm:divide-x divide-[#E6E3DC]">
            <div className="py-5 pr-4 lg:px-6 lg:first:pl-0">
              <div className="font-display text-2xl font-semibold text-[#171514] tabular-nums">
                8 hrs
              </div>
              <p className="text-xs text-[#6B6560] mt-1">
                Cocción lenta en olla de barro
              </p>
            </div>
            <div className="py-5 pl-4 lg:px-6">
              <div className="font-display text-2xl font-semibold text-[#171514] tabular-nums">
                1987
              </div>
              <p className="text-xs text-[#6B6560] mt-1">
                Tradición familiar en Guadalajara
              </p>
            </div>
            <div className="py-5 pr-4 lg:px-6">
              <div className="font-display text-2xl font-semibold text-[#171514] tabular-nums">
                100%
              </div>
              <p className="text-xs text-[#6B6560] mt-1">
                Maíz entero nixtamalizado diario
              </p>
            </div>
            <div className="py-5 pl-4 lg:px-6 lg:last:pr-0">
              <div className="font-display text-2xl font-semibold text-[#171514] tabular-nums">
                13:00–22:30
              </div>
              <p className="text-xs text-[#6B6560] mt-1">
                Martes a Domingo en Mexicaltzingo
              </p>
            </div>
          </div>
        </section>

        {/* Menú Section */}
        <section
          id="menu"
          className="max-w-6xl mx-auto px-6 py-16 sm:py-20"
          aria-labelledby="menu-heading"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-xl">
              <p className="text-xs font-medium text-[#9A1F18]">Menú del día</p>
              <h2
                id="menu-heading"
                className="font-display text-3xl sm:text-4xl font-semibold text-[#171514] tracking-tight text-balance"
              >
                La Carta de la Casa
              </h2>
              <p className="text-sm sm:text-base text-[#57514C]">
                Personaliza el tamaño, corte y verdura de tu pozole o agrega antojitos para compartir en mesa o pedir a domicilio en la ZMG.
              </p>
            </div>

            {/* Interactive Category Filter Controls */}
            <div
              role="tablist"
              aria-label="Filtrar platillos por categoría"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#EFECE6] rounded-lg self-start md:self-auto"
            >
              {CATEGORY_TABS.map((tab) => {
                const active = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[36px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18] ${
                      active
                        ? 'bg-white text-[#171514] shadow-sm'
                        : 'text-[#57514C] hover:text-[#171514]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-[#E6E3DC] rounded-xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] bg-[#EFECE6] overflow-hidden">
                  <ResilientImage
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs text-[#6B6560]">{item.meta}</p>
                  <h3 className="font-display text-xl font-semibold text-[#171514] mt-1.5">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#57514C] leading-relaxed mt-2 flex-1">
                    {item.description}
                  </p>

                  <div className="pt-5 mt-5 border-t border-[#EFECE6] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-[#6B6560] block">
                        {item.customizable ? 'Desde plato mediano' : 'Orden completa'}
                      </span>
                      <span className="text-base font-semibold text-[#171514] tabular-nums">
                        ${item.price} MXN
                      </span>
                    </div>

                    {item.customizable ? (
                      <button
                        type="button"
                        onClick={() => setCustomizingItem(item)}
                        className="px-4 py-2.5 bg-[#9A1F18] hover:bg-[#821812] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
                      >
                        Personalizar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleQuickAddItem(item)}
                        className="px-4 py-2.5 bg-[#171514] hover:bg-[#2C2826] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A1F18]"
                      >
                        Agregar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Tradition & Craftsmanship Section */}
        <section
          id="tradicion"
          className="bg-[#171514] text-[#F9F8F6] py-20 sm:py-24"
          aria-labelledby="tradicion-heading"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6">
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#231F1D]">
                  <ResilientImage
                    src={KITCHEN_IMAGE.src}
                    alt={KITCHEN_IMAGE.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-8">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-[#E5A39E]">
                    Oficio de cocina tapatía
                  </p>
                  <h2
                    id="tradicion-heading"
                    className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight text-balance"
                  >
                    Sin atajos industriales ni fondos en polvo
                  </h2>
                  <p className="text-sm sm:text-base text-[#D6D2CA] leading-relaxed">
                    Nuestro fogón enciende a las cinco de la mañana. Trabajamos con productores locales de maíz cacahuazintle de Los Altos de Jalisco y carne fresca de rastro certificado cada día.
                  </p>
                </div>

                <div className="divide-y divide-white/15 border-t border-b border-white/15">
                  {TRADITION_PILLARS.map((pillar) => (
                    <div key={pillar.number} className="py-5 space-y-1.5">
                      <h3 className="font-display text-lg font-semibold text-white">
                        {pillar.number} {pillar.title}
                      </h3>
                      <p className="text-sm text-[#C7C2B9] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Adjacent to Craft Claims */}
        <section
          id="resenas"
          className="max-w-6xl mx-auto px-6 py-20 sm:py-24"
          aria-labelledby="resenas-heading"
        >
          <div className="max-w-2xl space-y-2 mb-12">
            <p className="text-xs font-medium text-[#9A1F18]">
              Vecinos y comensales de la ciudad
            </p>
            <h2
              id="resenas-heading"
              className="font-display text-3xl sm:text-4xl font-semibold text-[#171514] tracking-tight text-balance"
            >
              Lo que cuentan nuestras mesas en Guadalajara
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {GUADALAJARA_REVIEWS.map((review) => (
              <figure
                key={review.name}
                className="bg-white border border-[#E6E3DC] rounded-xl p-6 flex flex-col justify-between gap-6"
              >
                <blockquote className="text-sm text-[#3F3A36] leading-relaxed">
                  “{review.quote}”
                </blockquote>
                <figcaption className="pt-4 border-t border-[#EFECE6]">
                  <div className="text-sm font-semibold text-[#171514]">{review.name}</div>
                  <div className="text-xs text-[#6B6560] mt-0.5">{review.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Location & Table Reservation */}
        <ReservationSection />
      </main>

      {/* Quiet Footer */}
      <footer className="bg-[#F9F8F6] border-t border-[#E6E3DC]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-display text-lg font-bold text-[#171514]">
              Pozolería El Pueblito
            </div>
            <p className="text-xs text-[#6B6560]">
              Calle Nicolás Regules 412, Barrio de Mexicaltzingo · Guadalajara, Jalisco · Mar–Dom 13:00–22:30 hrs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#57514C]">
            <a href="#menu" className="hover:text-[#171514] transition-colors">
              Menú
            </a>
            <a href="#tradicion" className="hover:text-[#171514] transition-colors">
              Tradición
            </a>
            <a href="#resenas" className="hover:text-[#171514] transition-colors">
              Reseñas
            </a>
            <a href="#ubicacion" className="hover:text-[#171514] transition-colors">
              Ubicación
            </a>
            <span className="text-[#8E877E]">© 2026 El Pueblito Guadalajara</span>
          </div>
        </div>
      </footer>

      {/* Subtle Add-to-Order Feedback Toast */}
      {addedFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-5 z-40 bg-[#171514] text-white px-4 py-3 rounded-xl shadow-xl border border-white/10 flex items-center gap-3 max-w-sm"
        >
          <Check className="w-4 h-4 text-[#7AD9A3] shrink-0" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-medium truncate">
            Agregado: {addedFeedback}
          </span>
          <button
            type="button"
            onClick={() => {
              setAddedFeedback(null);
              setIsDrawerOpen(true);
            }}
            className="text-xs font-semibold text-[#F5D0CD] hover:text-white underline underline-offset-2 whitespace-nowrap shrink-0 ml-1"
          >
            Ver pedido
          </button>
        </div>
      )}

      <PozoleCustomizerModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddCustomizedItem}
      />

      <OrderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <ChatWidget />
    </div>
  );
}
