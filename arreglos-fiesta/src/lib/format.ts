// Cambia la moneda y el idioma de la tienda aquí.
const CURRENCY = "MXN";
const LOCALE = "es-MX";

const formatter = new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY });

/** Los precios se guardan en centavos para evitar errores de redondeo. */
export function formatPrice(cents: number) {
  return formatter.format(cents / 100);
}
