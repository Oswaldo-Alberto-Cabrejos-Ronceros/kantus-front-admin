/**
 * Extrae una lista de items de una respuesta que puede ser un array plano
 * o una respuesta paginada del backend Spring (con campo `content`).
 *
 * Elimina la necesidad de escribir `(data as any)?.content?.map(...)` en cada composable.
 */
export function extractItems<T>(
  data: T[] | { content?: T[] } | null | undefined
): T[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  return (data as { content?: T[] }).content ?? []
}

/** Constantes de staleTime reutilizables */
export const STALE = {
  /** Datos que cambian en segundos: mesas, pedidos, cajas activas */
  LIVE: 30 * 1000,
  /** Datos que cambian en minutos: ventas, movimientos */
  MEDIUM: 2 * 60 * 1000,
  /** Datos casi estáticos: productos, categorías, empleados, proveedores */
  STATIC: 10 * 60 * 1000,
} as const
