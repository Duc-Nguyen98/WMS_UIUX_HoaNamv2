'use client';
import { useLayoutEffect, useRef, useState, useCallback } from 'react';
import {
  defaultRangeExtractor,
  useWindowVirtualizer,
} from '@tanstack/react-virtual';
import { ProductCard } from '@/components/preview-products';
import type { PreviewProduct } from '@/lib/product-preview';

/** Two-column mobile rows. Short lists keep normal DOM for accessibility and lower overhead. */
export default function PreviewVirtualProducts({
  products,
  onOpen,
}: {
  products: PreviewProduct[];
  onOpen: (id: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [margin, setMargin] = useState(0);
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  useLayoutEffect(() => {
    const measure = () =>
      setMargin(
        (root.current?.getBoundingClientRect().top ?? 0) + window.scrollY,
      );
    measure();
    const observer = new ResizeObserver(measure);
    if (root.current?.parentElement)
      observer.observe(root.current.parentElement);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  const rows = useWindowVirtualizer({
    count: Math.ceil(products.length / 2),
    estimateSize: () => 360,
    overscan: 4,
    scrollMargin: margin,
    getItemKey: (index) => products[index * 2].id,
    rangeExtractor: useCallback(
      (range: Parameters<typeof defaultRangeExtractor>[0]) => {
        const indices = defaultRangeExtractor(range);
        return focusedRow === null
          ? indices
          : [...new Set([...indices, focusedRow])].sort((a, b) => a - b);
      },
      [focusedRow],
    ),
  });
  return (
    <div
      ref={root}
      className="pv-virtual-grid"
      style={{ height: rows.getTotalSize() }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocusedRow(null);
      }}
    >
      {rows.getVirtualItems().map((row) => (
        <div
          key={row.key}
          ref={rows.measureElement}
          data-index={row.index}
          className="pv-virtual-row"
          style={{ transform: `translateY(${row.start - margin}px)` }}
          onFocusCapture={() => setFocusedRow(row.index)}
        >
          {products
            .slice(row.index * 2, row.index * 2 + 2)
            .map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={onOpen}
                index={row.index * 2 + index}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
