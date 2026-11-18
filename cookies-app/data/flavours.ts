export type Flavour = {
  id: string;
  name: string;
  short: string;
  desc: string;
  bg: string; // fondo del spotlight
  dough: string; // color de la masa
  doughDark: string;
  chunks: string[]; // colores de los trozos
  drizzle?: string;
  drizzle2?: string;
  topping?: "hearts" | "berries" | "cookie" | "marshmallow" | "caramel" | "nuts" | "none";
  /** Foto real recortada (PNG/WebP sin fondo, cuadrada). Si existe, reemplaza a la ilustración. */
  photo?: string;
};

export const FLAVOURS: Flavour[] = [
  {
    id: "clasica", name: "Clásica con chips", short: "Clásica",
    desc: "Masa de manteca dorada, centro húmedo y trozos de semiamargo. Si querés, con tu nombre en letras de chocolate.",
    photo: "cookies/clasica.webp",
    bg: "#F5EDE6", dough: "#D9A066", doughDark: "#A86A35", chunks: ["#3B1E14", "#4A2618"], topping: "none",
  },
  {
    id: "red-velvet", name: "Red velvet", short: "Red velvet",
    desc: "Masa red velvet con chips de chocolate blanco, drizzle de vainilla y corazones rosas.",
    photo: "cookies/red-velvet.webp",
    bg: "#F7DCE3", dough: "#B23A48", doughDark: "#7E2230", chunks: ["#FFF6EC", "#F8EBDD"], drizzle: "#FFF3E6", topping: "hearts",
  },
  {
    id: "dulce-de-leche", name: "Dulce de leche", short: "DDL",
    desc: "Rellena con dulce de leche repostero que se derrite al partirla, con hilos de caramelo arriba.",
    bg: "#F3E1C7", dough: "#D49A5A", doughDark: "#9C6430", chunks: ["#8A4B1F", "#B8722F"], topping: "caramel",
  },
  {
    id: "frambuesa", name: "Frambuesa y blanco", short: "Frambuesa",
    desc: "Frambuesas, chocolate blanco y bombones crocantes. Ácida, dulce y súper fotogénica.",
    photo: "cookies/frambuesa.webp",
    bg: "#F8D9DF", dough: "#E2B47A", doughDark: "#B07C43", chunks: ["#C2185B", "#FFF6EC"], drizzle: "#FFF3E6", topping: "berries",
  },
  {
    id: "choco-rosa", name: "Choco rosa", short: "Choco rosa",
    desc: "Doble chocolate, centro bien gooey y drizzle de chocolate rosa con corazones blancos.",
    photo: "cookies/choco-rosa.webp",
    bg: "#EFD3D9", dough: "#5A3221", doughDark: "#3B1E14", chunks: ["#2A120A", "#7A4A33"], drizzle: "#F2A7C3", topping: "hearts",
  },
  {
    id: "oreo", name: "Oreo", short: "Oreo",
    desc: "Masa de cacao negro con trozos de Oreo y chocolate blanco. Cookies and cream en serio.",
    bg: "#E6E1DE", dough: "#3A2A26", doughDark: "#1E1513", chunks: ["#F4EFEA", "#111111"], topping: "cookie",
  },
  {
    id: "marshmallow", name: "Marshmallow tostado", short: "Marsh",
    desc: "Chocolate con leche, galletita y marshmallows tostados con soplete. Fogón en una cookie.",
    bg: "#F2E6DA", dough: "#C98E54", doughDark: "#93592A", chunks: ["#3B1E14", "#5A2E1A"], topping: "marshmallow",
  },
];

export const flavourById = (id: string) => FLAVOURS.find((f) => f.id === id)!;

/** Sabores que se muestran en la web: solo los que tienen foto real.
 *  Para sumar uno, agregá su foto en public/cookies/ y el campo `photo`. */
export const MENU: Flavour[] = FLAVOURS.filter((f) => f.photo);

/** Para pedidos viejos o de ejemplo: si un sabor no está en el menú, usa uno que sí. */
export const inMenu = (id: string, i = 0) => (MENU.some((f) => f.id === id) ? id : MENU[i % MENU.length].id);
