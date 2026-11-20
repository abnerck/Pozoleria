export type MenuCategory = 'todos' | 'pozoles' | 'antojitos' | 'bebidas';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'todos'>;
  categoryLabel: string;
  meta: string;
  description: string;
  price: number;
  image: string;
  imageAlt: string;
  customizable?: boolean;
  defaultProtein?: string;
}

export interface PozoleSizeOption {
  id: 'chico' | 'mediano' | 'grande';
  label: string;
  portion: string;
  priceDelta: number;
}

export interface PozoleProteinOption {
  id: string;
  label: string;
  detail: string;
  priceDelta: number;
}

export interface PozoleExtraOption {
  id: string;
  label: string;
  price: number;
}

export interface CartItem {
  cartId: string;
  menuItemId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  customization?: {
    sizeLabel: string;
    proteinLabel: string;
    greensLabel: string;
    extras: string[];
    notes?: string;
  };
}

export const HERO_IMAGE = {
  src: '/src/assets/images/hero_pozole_rojo_1795139059510.jpg',
  alt: 'Cazuela de barro con pozole rojo jalisciense humeante, maíz cacahuazintle, rábanos, col picada y tostadas en mesa de piedra volcánica',
};

export const KITCHEN_IMAGE = {
  src: '/src/assets/images/cocina_tradicional_barro_1795139061868.jpg',
  alt: 'Cocina tradicional de El Pueblito en Guadalajara con ollas de barro hirviendo a fuego lento y canastas de chiles guajillos y maíz blanco',
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'pozole-rojo',
    name: 'Pozole Rojo Jalisciense',
    category: 'pozoles',
    categoryLabel: 'Pozoles',
    meta: 'Receta de la casa · Sin gluten',
    description:
      'Caldo profundo de hueso de cerdo cocido ocho horas con adobo molido en casa de chile guajillo, ancho y ajo asado. Servido con maíz cacahuazintle reventado.',
    price: 145,
    image: '/src/assets/images/hero_pozole_rojo_1795139059510.jpg',
    imageAlt: 'Pozole rojo estilo Jalisco en cazuela de barro con rábanos y col',
    customizable: true,
    defaultProtein: 'maciza',
  },
  {
    id: 'pozole-verde',
    name: 'Pozole Verde de Pepita y Serrano',
    category: 'pozoles',
    categoryLabel: 'Pozoles',
    meta: 'Pepita tostada · Herbal',
    description:
      'Caldo cremoso de pepita de calabaza tostada en comal, tomatillo milpero, chile poblano, cilantro fresco y epazote. Acompañado con aguacate en abanico.',
    price: 155,
    image: '/src/assets/images/pozole_verde_tapatio_1795139058635.jpg',
    imageAlt: 'Pozole verde con pepita tostada, aguacate y pollo deshebrado',
    customizable: true,
    defaultProtein: 'pollo',
  },
  {
    id: 'pozole-blanco',
    name: 'Pozole Blanco Tradicional',
    category: 'pozoles',
    categoryLabel: 'Pozoles',
    meta: 'Caldo claro · Aromático',
    description:
      'La esencia pura del maíz cacahuazintle en caldo limpio de pierna y espinazo con laurel y cebolla asada. Ideal para sazonar al gusto con salsa de árbol en mesa.',
    price: 135,
    image: '/src/assets/images/pozole_blanco_tradicional_1795139060131.jpg',
    imageAlt: 'Pozole blanco tradicional con grano blanco, limón y tostadas doradas',
    customizable: true,
    defaultProtein: 'surtida',
  },
  {
    id: 'tostadas-pata',
    name: 'Orden de Tostadas de Pata o Lomo',
    category: 'antojitos',
    categoryLabel: 'Antojitos',
    meta: '2 piezas · Maíz raspado',
    description:
      'Tortilla artesanal raspada y dorada al momento con frijoles puercos, pata curada en vinagre de piña o lomo deshebrado, col, crema de rancho y salsa jitomate.',
    price: 98,
    image: '/src/assets/images/antojitos_tostadas_flautas_1795139059524.jpg',
    imageAlt: 'Tostadas crujientes estilo Guadalajara con crema, queso fresco y cebolla encurtida',
  },
  {
    id: 'flautas-doradas',
    name: 'Flautas Tapatías de Papa y Requesón',
    category: 'antojitos',
    categoryLabel: 'Antojitos',
    meta: '4 piezas · Bañadas en salsa',
    description:
      'Tacos dorados crujientes rellenos de papa sazonada con requesón fresco, bañados en caldillo tibio de jitomate, col rallada y queso cotija añejo.',
    price: 105,
    image: '/src/assets/images/antojitos_tostadas_flautas_1795139059524.jpg',
    imageAlt: 'Flautas doradas crujientes con crema fresca y salsa roja',
  },
  {
    id: 'jericalla-horchata',
    name: 'Jericalla de Olla y Agua Fresca',
    category: 'bebidas',
    categoryLabel: 'Bebidas y Postres',
    meta: 'Horneada en barro · Canela de Ceilán',
    description:
      'Clásico postre de Guadalajara horneado a baño María hasta lograr su costra tostada, acompañado de un vaso frío de horchata de arroz o jamaica natural.',
    price: 88,
    image: '/src/assets/images/bebidas_jericalla_horchata_1795139061239.jpg',
    imageAlt: 'Jericalla tapatía quemada en cazuelita de barro junto a horchata y agua de jamaica',
  },
];

export const POZOLE_SIZES: PozoleSizeOption[] = [
  { id: 'chico', label: 'Chico', portion: '500 ml', priceDelta: -20 },
  { id: 'mediano', label: 'Mediano', portion: '750 ml', priceDelta: 0 },
  { id: 'grande', label: 'Grande', portion: '1,000 ml', priceDelta: 35 },
];

export const POZOLE_PROTEINS: PozoleProteinOption[] = [
  { id: 'maciza', label: 'Maciza de cerdo', detail: 'Corte magro y suave', priceDelta: 0 },
  { id: 'surtida', label: 'Surtida tapatía', detail: 'Maciza, trompa y oreja', priceDelta: 10 },
  { id: 'pollo', label: 'Pechuga de pollo', detail: 'Deshebrada al momento', priceDelta: 0 },
  { id: 'setas', label: 'Setas y flor de calabaza', detail: 'Caldo vegetal asado', priceDelta: 0 },
];

export const POZOLE_GREENS = [
  { id: 'col', label: 'Col rallada (estilo Jalisco)' },
  { id: 'lechuga', label: 'Lechuga romana picada' },
  { id: 'mixta', label: 'Mitad col, mitad lechuga' },
];

export const POZOLE_EXTRAS: PozoleExtraOption[] = [
  { id: 'aguacate', label: 'Abanico de aguacate Hass', price: 28 },
  { id: 'chicharron', label: 'Chicharrón prensado dorado', price: 32 },
  { id: 'tostadas', label: '3 tostadas raspadas extra', price: 26 },
  { id: 'panela', label: 'Cubos de queso panela fresco', price: 24 },
];

export const TRADITION_PILLARS = [
  {
    number: '01.',
    title: 'Nixtamalización diaria en casa',
    description:
      'Cada madrugada cocemos maíz cacahuazintle entero con cal de piedra en ollas curadas, descabezando grano por grano para que florezca suave sin deshacerse en el plato.',
  },
  {
    number: '02.',
    title: 'Adobo molido de tres chiles',
    description:
      'Tostamos chile guajillo de Zacatecas, chile ancho dulce y chile puya en comal de barro, hidratados en el mismo fondo de cocción para lograr un rojo limpio sin exceso de grasa.',
  },
  {
    number: '03.',
    title: 'Guarnición fresca y tostada raspada',
    description:
      'Servimos la mesa con rábano rojo de huerta, col finamente picada, cebolla blanca, orégano de cerro del Tequila, limón colima y chile de árbol seco molido al molcajete.',
  },
];

export const GUADALAJARA_REVIEWS = [
  {
    name: 'Mariana Castellanos',
    role: 'Arquitecta · Col. Americana, Guadalajara',
    quote:
      'Llevaba años buscando un pozole rojo que no pesara al estómago y aquí el caldo tiene cuerpo limpio, el grano está reventado en su punto y las tostadas de pata llegan siempre crujientes.',
  },
  {
    name: 'Rodolfo Villaseñor',
    role: 'Médico · Barrio de Mexicaltzingo',
    quote:
      'Venimos cada domingo después de la ciclovía en Chapultepec. El patio con la fuente mantiene la frescura de las casonas antiguas y la jericalla tibia cierra la comida como en casa de la abuela.',
  },
  {
    name: 'Sofía Echeverría',
    role: 'Productora cultural · Centro Histórico',
    quote:
      'Mi esposo pide siempre el surtido grande y yo el verde de pepita con setas. La atención es rápida sin prisas innecesarias y poder reservar mesa en línea nos ahorró la fila del sábado.',
  },
];
