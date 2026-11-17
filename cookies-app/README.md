# la chica de las cookies · tienda + tablero de cocina

Next.js (App Router) + TypeScript + Tailwind v4 + Framer Motion + Zustand + Lucide.

## Rutas
- `/` landing: hero, promos, tamaños de caja, "cómo funciona" (scroll horizontal), los 7 sabores (scroll spotlight) y footer.
- `/tienda` constructor de cajas (4 / 6 / 12) con cookies que vuelan a la caja y checkout en 3 pasos sin cuenta.
- `/cocina` tablero en vivo (Kanban Nuevos → En el horno → Listos), KPIs, lista de horneado y simulador de pedidos.

Los pedidos se guardan en `localStorage` y se sincronizan entre pestañas con el evento `storage`:
un pedido hecho en `/tienda` aparece al instante en `/cocina` abierta en otra pestaña.

## Editar contenido
- Marca, precios, horarios, WhatsApp y aviso de demo: `data/config.ts`
- Sabores (nombre, descripción, colores de la ilustración): `data/flavours.ts`
- Pedidos de ejemplo: `store/orders.ts`

## Comandos
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (para Vercel)
```

Demo de un solo archivo (sin rutas, navega con #tienda / #cocina):
```bash
NEXT_PUBLIC_SPA=1 npx next build && python3 scripts/pack-artifact.py
```

Abrí `/?nointro` para saltear el preloader (se muestra una vez por sesión).
