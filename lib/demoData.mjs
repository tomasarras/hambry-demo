// Fixed demo catalog: fictional restaurants across a handful of common
// Argentine delivery cuisines. Each restaurant has its own menu categories
// and items — restaurantSlug ties items/categories back to their restaurant
// when seeding (see lib/demoReset.js and prisma/seed.mjs).

export const RESTAURANTS = [
  {
    slug: "la-estacion-pizzeria",
    name: "La Estación Pizzería",
    cuisine: "Pizzas",
    description: "Pizza a la piedra de horno de barro, de las de barrio de toda la vida.",
    deliveryFee: 900,
    etaMinutes: 35,
    rating: 4.7,
  },
  {
    slug: "sushi-roll",
    name: "Sushi Roll",
    cuisine: "Sushi",
    description: "Rolls y bocaditos frescos, armados al momento.",
    deliveryFee: 1200,
    etaMinutes: 40,
    rating: 4.5,
  },
  {
    slug: "burger-house",
    name: "Burger House",
    cuisine: "Hamburguesas",
    description: "Smash burgers con pan de papa casero.",
    deliveryFee: 800,
    etaMinutes: 25,
    rating: 4.6,
  },
  {
    slug: "wok-express",
    name: "Wok Express",
    cuisine: "Comida china",
    description: "Salteados al wok, bien calientes, listos en minutos.",
    deliveryFee: 700,
    etaMinutes: 30,
    rating: 4.3,
  },
  {
    slug: "verde-vida",
    name: "Verde Vida",
    cuisine: "Saludable",
    description: "Bowls, ensaladas y jugos prensados en frío.",
    deliveryFee: 950,
    etaMinutes: 30,
    rating: 4.8,
  },
  {
    slug: "dulce-hogar",
    name: "Dulce Hogar",
    cuisine: "Panadería y postres",
    description: "Facturas, tortas y postres caseros recién horneados.",
    deliveryFee: 600,
    etaMinutes: 20,
    rating: 4.9,
  },
];

export const MENU = {
  "la-estacion-pizzeria": {
    categories: ["Pizzas", "Entradas", "Bebidas"],
    items: [
      { name: "Muzzarella", category: "Pizzas", price: 6800, description: "Salsa de tomate, muzzarella y orégano." },
      { name: "Napolitana", category: "Pizzas", price: 7400, description: "Muzzarella, tomate en rodajas, ajo y albahaca." },
      { name: "Fugazzeta rellena", category: "Pizzas", price: 8200, description: "Doble masa rellena de muzzarella, cebolla caramelizada." },
      { name: "Cuatro quesos", category: "Pizzas", price: 8600, description: "Muzzarella, roquefort, provolone y parmesano." },
      { name: "Empanadas de carne (x6)", category: "Entradas", price: 4200, description: "Repulgo tradicional, horneadas." },
      { name: "Papas fritas con cheddar", category: "Entradas", price: 3600, description: "Con cheddar fundido y panceta." },
      { name: "Gaseosa línea Coca-Cola 500ml", category: "Bebidas", price: 1400 },
      { name: "Agua mineral 500ml", category: "Bebidas", price: 900 },
    ],
  },
  "sushi-roll": {
    categories: ["Rolls", "Entradas", "Bebidas"],
    items: [
      { name: "California roll (8u)", category: "Rolls", price: 5200, description: "Kani, palta y pepino." },
      { name: "Philadelphia roll (8u)", category: "Rolls", price: 5800, description: "Salmón, queso crema y ciboulette." },
      { name: "Roll langostino tempura (8u)", category: "Rolls", price: 6900, description: "Langostino tempurizado, palta y salsa spicy." },
      { name: "Sashimi de salmón (6 cortes)", category: "Rolls", price: 6400 },
      { name: "Gyozas de vegetales (5u)", category: "Entradas", price: 3800 },
      { name: "Sopa miso", category: "Entradas", price: 2600 },
      { name: "Té verde frío", category: "Bebidas", price: 1600 },
    ],
  },
  "burger-house": {
    categories: ["Hamburguesas", "Acompañamientos", "Bebidas"],
    items: [
      { name: "Smash simple", category: "Hamburguesas", price: 5200, description: "Medallón smash, cheddar, cebolla caramelizada, pan de papa." },
      { name: "Smash doble", category: "Hamburguesas", price: 6800, description: "Doble medallón, doble cheddar, panceta." },
      { name: "Veggie", category: "Hamburguesas", price: 5600, description: "Medallón de garbanzos y vegetales grillados." },
      { name: "Papas fritas", category: "Acompañamientos", price: 2800 },
      { name: "Aros de cebolla", category: "Acompañamientos", price: 3200 },
      { name: "Milkshake de chocolate", category: "Bebidas", price: 2600 },
      { name: "Gaseosa línea Coca-Cola 500ml", category: "Bebidas", price: 1400 },
    ],
  },
  "wok-express": {
    categories: ["Salteados", "Arroces y fideos", "Bebidas"],
    items: [
      { name: "Pollo con vegetales al wok", category: "Salteados", price: 5400 },
      { name: "Ternera con brócoli", category: "Salteados", price: 6200 },
      { name: "Camarones al wok con verdeo", category: "Salteados", price: 6900 },
      { name: "Arroz frito con huevo", category: "Arroces y fideos", price: 4200 },
      { name: "Fideos de arroz salteados", category: "Arroces y fideos", price: 4400 },
      { name: "Agua saborizada 500ml", category: "Bebidas", price: 1100 },
    ],
  },
  "verde-vida": {
    categories: ["Bowls", "Ensaladas", "Jugos y licuados"],
    items: [
      { name: "Bowl bio (quinoa, palta, garbanzos)", category: "Bowls", price: 5800 },
      { name: "Bowl proteico (pollo grillado, batata, huevo)", category: "Bowls", price: 6400 },
      { name: "Ensalada César con pollo", category: "Ensaladas", price: 5600 },
      { name: "Ensalada caprese", category: "Ensaladas", price: 4800 },
      { name: "Jugo de naranja exprimido", category: "Jugos y licuados", price: 2200 },
      { name: "Licuado de frutilla y banana", category: "Jugos y licuados", price: 2600 },
    ],
  },
  "dulce-hogar": {
    categories: ["Facturas y panadería", "Tortas y postres"],
    items: [
      { name: "Docena de facturas surtidas", category: "Facturas y panadería", price: 4800 },
      { name: "Medialunas de manteca (x6)", category: "Facturas y panadería", price: 2600 },
      { name: "Pan casero", category: "Facturas y panadería", price: 1800 },
      { name: "Porción de torta de chocolate", category: "Tortas y postres", price: 2400 },
      { name: "Flan casero con dulce de leche", category: "Tortas y postres", price: 2200 },
      { name: "Cheesecake de frutos rojos (porción)", category: "Tortas y postres", price: 2800 },
    ],
  },
};
