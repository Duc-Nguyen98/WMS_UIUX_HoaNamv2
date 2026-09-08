export const PREVIEW_SEARCH_DELAY = 220;

/** Paging only reveals records already present; never manufacture extra products. */
export function previewPageLimit(total: number, current = 0, batch = 4) {
  return Math.min(
    Math.max(0, total),
    Math.max(0, current) + Math.max(1, batch),
  );
}

export function previewListKey(scope: string, ids: readonly string[]) {
  return JSON.stringify([scope, ids]);
}

export function relatedPreviewProducts<
  T extends { id: string; category: string; group: string },
>(product: T, products: readonly T[]) {
  const sameCategory = products.filter(
    (item) => item.id !== product.id && item.category === product.category,
  );
  return {
    products: sameCategory.length
      ? sameCategory
      : products.filter(
          (item) => item.id !== product.id && item.group === product.group,
        ),
    sameCategory: sameCategory.length > 0,
  };
}
