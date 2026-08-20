import { z } from 'zod';

/**
 * Rangos de fecha para filtros de listado.
 *
 * Los selectores `<input type="date">` mandan un día calendario suelto
 * (`2026-08-11`), pero las columnas que se filtran son `timestamptz`. Traducir
 * uno a otro exige decidir **de quién es ese día**, y la respuesta aquí es del
 * negocio: RUTA opera solo en Colombia (UTC-5 todo el año, sin horario de
 * verano), así que «los pedidos del 11 de agosto» son los de ese día en Bogotá,
 * no en UTC. Anclarlo a UTC desplazaría el corte cinco horas y metería en el 11
 * los pedidos de la tarde-noche del 10.
 *
 * El límite superior es **exclusivo**: el día siguiente a las 00:00. Con un
 * `lte` al inicio del día `date_to` se perdería todo lo ocurrido en esa fecha,
 * que es justo lo que el operador cree estar incluyendo al seleccionarla.
 */

/** Colombia no tiene horario de verano; el desfase es constante. */
const BOGOTA_UTC_OFFSET = '-05:00';

/** `YYYY-MM-DD`. Mismo formato que `DATE_ONLY_PATTERN` en `delivery_schedule`. */
export const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isDateOnly(value: string): boolean {
  return DATE_ONLY_PATTERN.test(value);
}

/**
 * Inicio del día en Bogotá, como instante UTC.
 * `2026-08-11` → `2026-08-11T05:00:00.000Z`.
 *
 * Acepta también un ISO-8601 completo y lo devuelve tal cual, para no romper a
 * los Clientes API que ya mandan instantes exactos.
 */
export function startOfBogotaDay(value: string): Date {
  if (!isDateOnly(value)) return new Date(value);
  return new Date(`${value}T00:00:00.000${BOGOTA_UTC_OFFSET}`);
}

/**
 * Instante **exclusivo** en que termina el día en Bogotá: el inicio del
 * siguiente. `2026-08-11` → `2026-08-12T05:00:00.000Z`.
 */
export function endOfBogotaDayExclusive(value: string): Date {
  if (!isDateOnly(value)) return new Date(value);
  const start = startOfBogotaDay(value);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000);
}

/**
 * Valida un filtro de fecha: día calendario o ISO-8601 completo. Se usa como
 * `.refine()` para que un `2026-13-45` no llegue a Prisma como `Invalid Date`.
 */
export function isValidDateFilter(value: string): boolean {
  if (!isDateOnly(value)) return !Number.isNaN(Date.parse(value));

  /*
   * No basta con `Date.parse`: `2026-02-30` **no** devuelve NaN, se desborda a
   * 2 de marzo. Un día que no existe pasaría la validación y filtraría por otra
   * fecha sin decir nada. Se comprueba que la fecha construida sea la misma que
   * se escribió.
   */
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return false;

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() + 1 === month &&
    parsed.getUTCDate() === day
  );
}

/**
 * Validador para los `from`/`to`/`date_from`/`date_to` de los listados.
 *
 * Varios esquemas usaban `z.string().datetime()`, que exige un ISO-8601
 * completo, mientras que todas las pantallas filtran con `<input type="date">`
 * y mandan `2026-08-11`. El resultado era un **400 que rompía el listado
 * entero** en pedidos, auditoría y reembolsos. Aquí se aceptan los dos
 * formatos: el día calendario de la interfaz y el instante exacto que ya
 * mandan los Clientes API.
 */
export const dateFilterSchema = z
  .string()
  .refine(isValidDateFilter, 'Usa YYYY-MM-DD o una fecha ISO-8601 completa');
