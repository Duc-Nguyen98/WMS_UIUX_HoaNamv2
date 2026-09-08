import type { PreviewProduct } from './product-preview';

export const LIBRARY_STORAGE_KEY = 'hoanam.preview.library.v1';
export type DeviceLibrary = { recent: string[]; saved: string[] };
export const EMPTY_LIBRARY: DeviceLibrary = { recent: [], saved: [] };

// Persist only product IDs. Names, stock and photos always come from the current catalogue.
export function knownProductIds(
  value: unknown,
  products: readonly PreviewProduct[],
  limit = 100,
): string[] {
  if (!Array.isArray(value)) return [];
  const known = new Set(products.map((item) => item.id));
  return [
    ...new Set(
      value.filter(
        (id): id is string => typeof id === 'string' && known.has(id),
      ),
    ),
  ].slice(0, limit);
}
export function readDeviceLibrary(
  raw: string | null,
  products: readonly PreviewProduct[],
): DeviceLibrary {
  try {
    const data: unknown = JSON.parse(raw ?? '{}');
    if (!data || typeof data !== 'object') return { recent: [], saved: [] };
    return {
      recent: knownProductIds(
        'recent' in data ? data.recent : [],
        products,
        30,
      ),
      saved: knownProductIds('saved' in data ? data.saved : [], products),
    };
  } catch {
    return { recent: [], saved: [] };
  }
}
export function recordRecent(
  library: DeviceLibrary,
  id: string,
  products: readonly PreviewProduct[],
): DeviceLibrary {
  return {
    ...library,
    recent: knownProductIds([id, ...library.recent], products, 30),
  };
}
export function toggleSaved(
  library: DeviceLibrary,
  id: string,
  products: readonly PreviewProduct[],
): DeviceLibrary {
  return {
    ...library,
    saved: knownProductIds(
      library.saved.includes(id)
        ? library.saved.filter((entry) => entry !== id)
        : [id, ...library.saved],
      products,
    ),
  };
}
export function comparisonSelection(
  ids: readonly string[],
  id: string,
  products: readonly PreviewProduct[],
): { ids: string[]; error?: string } {
  const current = knownProductIds(ids, products, 3);
  if (current.includes(id))
    return { ids: current.filter((entry) => entry !== id) };
  const item = products.find((product) => product.id === id);
  if (!item) return { ids: current, error: 'Sản phẩm hiện không khả dụng.' };
  if (current.length >= 3)
    return {
      ids: current,
      error:
        'Bạn có thể so sánh tối đa 3 sản phẩm. Hãy bỏ một sản phẩm để chọn thêm.',
    };
  const first = products.find((product) => product.id === current[0]);
  if (first && (first.group !== item.group || first.category !== item.category))
    return {
      ids: current,
      error:
        'Hãy chọn các sản phẩm cùng danh mục để so sánh. Bạn có thể xóa lựa chọn hiện tại để đổi danh mục.',
    };
  return { ids: [...current, id] };
}
