import { describe, it, expect } from 'vitest';
import {
  dateFilterSchema,
  startOfBogotaDay,
  endOfBogotaDayExclusive,
  isValidDateFilter,
} from './date_range.js';

/**
 * Estas fronteras las comparten cinco listados (pedidos, auditoría, reembolsos,
 * disputas y entregas de webhook). Si se mueven, se mueven todas a la vez, así
 * que conviene tenerlas fijadas aquí y no en cada endpoint.
 */

describe('dateFilterSchema', () => {
  it('acepta el día calendario que manda `<input type="date">`', () => {
    // Era `z.string().datetime()`, que lo rechazaba: 400 y listado roto.
    expect(dateFilterSchema.safeParse('2026-08-11').success).toBe(true);
  });

  it('acepta un ISO-8601 completo, con y sin offset', () => {
    expect(dateFilterSchema.safeParse('2026-08-11T13:30:00.000Z').success).toBe(true);
    expect(dateFilterSchema.safeParse('2026-08-11T13:30:00.000-05:00').success).toBe(true);
  });

  it('rechaza texto que no es una fecha', () => {
    expect(dateFilterSchema.safeParse('ayer').success).toBe(false);
    expect(dateFilterSchema.safeParse('').success).toBe(false);
  });

  it('rechaza un día que no existe en el calendario', () => {
    expect(isValidDateFilter('2026-02-30')).toBe(false);
    expect(isValidDateFilter('2026-13-01')).toBe(false);
  });
});

describe('fronteras del día en Bogotá', () => {
  it('el día empieza a las 05:00Z, no a medianoche UTC', () => {
    // Colombia es UTC-5 todo el año. Anclarlo a UTC metería en el 11 los
    // pedidos de la tarde-noche del 10.
    expect(startOfBogotaDay('2026-08-11').toISOString()).toBe('2026-08-11T05:00:00.000Z');
  });

  it('el límite superior es el inicio del día siguiente, y es exclusivo', () => {
    expect(endOfBogotaDayExclusive('2026-08-11').toISOString()).toBe('2026-08-12T05:00:00.000Z');
  });

  it('un solo día abarca 24 horas exactas', () => {
    const inicio = startOfBogotaDay('2026-08-11');
    const fin = endOfBogotaDayExclusive('2026-08-11');
    expect((fin.getTime() - inicio.getTime()) / 3_600_000).toBe(24);
  });

  it('cruza el fin de mes sin saltarse días', () => {
    expect(endOfBogotaDayExclusive('2026-08-31').toISOString()).toBe('2026-09-01T05:00:00.000Z');
  });

  it('sigue funcionando en año bisiesto', () => {
    expect(endOfBogotaDayExclusive('2028-02-28').toISOString()).toBe('2028-02-29T05:00:00.000Z');
  });

  it('un instante ISO completo se respeta tal cual, sin desplazarlo', () => {
    // Los Clientes API ya mandan instantes exactos; no hay que reinterpretarlos
    // como días.
    const exacto = '2026-08-11T13:30:00.000Z';
    expect(startOfBogotaDay(exacto).toISOString()).toBe(exacto);
    expect(endOfBogotaDayExclusive(exacto).toISOString()).toBe(exacto);
  });
});
