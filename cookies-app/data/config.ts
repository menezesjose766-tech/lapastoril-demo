// Toda la marca, textos y precios en un solo lugar.
export const BRAND = {
  name: "la chica de las cookies",
  short: "lcc",
  city: "Tandil",
  instagram: "valenn_colotti",
  instagramUrl: "https://instagram.com/valenn_colotti",
  tiktokUrl: "https://tiktok.com",
  // Número de WhatsApp para pedidos: 549 + área + número (vacío = demo)
  whatsapp: "",
  hours: "Mié a dom · 10 a 19 hs",
  demo: true, // muestra el aviso "Demo · propuesta de diseño"
};

export type BoxSize = 4 | 6 | 12;

export const BOXES: Record<BoxSize, { size: BoxSize; name: string; price: number; when: string; blurb: string }> = {
  4: { size: 4, name: "La cajita", price: 12000, when: "Lunes y martes", blurb: "Cuatro cookies para el antojo de principio de semana." },
  6: { size: 6, name: "La de siempre", price: 17500, when: "Todos los días", blurb: "Seis cookies, la caja que más sale." },
  12: { size: 12, name: "La fiestera", price: 32000, when: "Para compartir (o no)", blurb: "Doce cookies para cumples, oficinas y juntadas." },
};

export const DELIVERY_FEE = 2000;

export const SLOTS = ["10 a 12 hs", "12 a 14 hs", "14 a 16 hs", "16 a 18 hs"];

export const money = (n: number) => "$" + n.toLocaleString("es-AR");
