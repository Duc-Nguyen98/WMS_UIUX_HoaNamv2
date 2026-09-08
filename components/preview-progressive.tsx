'use client';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  lazy,
  Suspense,
  type ReactNode,
} from 'react';
import { ArrowDown, LoaderCircle } from 'lucide-react';
import { previewListKey, previewPageLimit } from '@/lib/preview-progressive';
import type { PreviewProduct } from '@/lib/product-preview';
import { ProductCard } from '@/components/preview-products';
import {
  SmoothPreviewButton,
  revealPreviewElement,
} from '@/components/preview-motion';
import { useReducedMotion } from 'motion/react';
const VirtualProducts = lazy(
  () => import('@/components/preview-virtual-products'),
);

type PagingMemory = { lists: Map<string, number>; sections: Set<string> };
const PagingContext = createContext<PagingMemory | null>(null);
export function PreviewPagingProvider({ children }: { children: ReactNode }) {
  const [memory] = useState<PagingMemory>(() => ({
    lists: new Map(),
    sections: new Set(),
  }));
  return (
    <PagingContext.Provider value={memory}>{children}</PagingContext.Provider>
  );
}

export function ProgressiveProducts({
  products,
  scope,
  onOpen,
  initial = 4,
  batch = 4,
  pending = false,
  className = 'pv-product-grid',
  renderProduct,
}: {
  products: PreviewProduct[];
  scope: string;
  onOpen: (id: string) => void;
  initial?: number;
  batch?: number;
  pending?: boolean;
  className?: string;
  renderProduct?: (product: PreviewProduct) => ReactNode;
}) {
  const listKey = previewListKey(
    scope,
    products.map((p) => p.id),
  );
  return (
    <ProductBatches
      key={listKey}
      {...{
        products,
        listKey,
        onOpen,
        initial,
        batch,
        pending,
        className,
        renderProduct,
      }}
    />
  );
}

function ProductBatches({
  products,
  listKey,
  onOpen,
  initial,
  batch,
  pending,
  className,
  renderProduct,
}: {
  products: PreviewProduct[];
  listKey: string;
  onOpen: (id: string) => void;
  initial: number;
  batch: number;
  pending: boolean;
  className: string;
  renderProduct?: (product: PreviewProduct) => ReactNode;
}) {
  const memory = useContext(PagingContext);
  const [limit, setLimit] = useState(() =>
    Math.min(products.length, memory?.lists.get(listKey) ?? initial),
  );
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const frame = useRef(0);
  const nextFrame = useRef(0);
  const limitRef = useRef(limit);
  const manualFocus = useRef<number | null>(null);
  const hasMore = limit < products.length;
  const virtual = !renderProduct && products.length >= 80;
  const reduced = useReducedMotion();
  const animatedLimit = useRef(0);
  useEffect(() => {
    const nodes = [...(grid.current?.children ?? [])].slice(
      animatedLimit.current,
    );
    animatedLimit.current = limit;
    if (reduced !== false || virtual || !nodes.length) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    import('gsap')
      .then(({ gsap }) => {
        if (disposed) return;
        const context = gsap.context(() =>
          gsap.fromTo(
            nodes,
            { opacity: 0.5, y: 6 },
            {
              opacity: 1,
              y: 0,
              duration: 0.18,
              stagger: 0.025,
              ease: 'power1.out',
              clearProps: 'opacity,transform',
            },
          ),
        );
        cleanup = () => context.revert();
      })
      .catch(() => {
        /* Content is visible even if optional animation code is unavailable. */
      });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [limit, reduced, virtual]);
  useEffect(() => {
    memory?.lists.set(listKey, limit);
    if (memory && memory.lists.size > 60)
      memory.lists.delete(memory.lists.keys().next().value!);
    if (manualFocus.current !== null && !loading) {
      const index = manualFocus.current;
      manualFocus.current = null;
      const item = (grid.current?.querySelector(
        `[data-preview-index="${index}"]`,
      ) ?? grid.current?.children[index]) as HTMLElement | undefined;
      const target = item?.matches('button')
        ? item
        : item?.querySelector<HTMLElement>('button, a');
      target?.focus({ preventScroll: true });
      if (target) revealPreviewElement(target);
    }
  }, [limit, loading, memory, listKey]);
  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      cancelAnimationFrame(nextFrame.current);
    },
    [],
  );
  const loadMore = useCallback(
    (manual = false) => {
      if (busy.current || pending || limitRef.current >= products.length)
        return;
      busy.current = true;
      if (manual) manualFocus.current = limitRef.current;
      setLoading(true);
      // Let the pending frame paint, then append one batch. No artificial network delay.
      frame.current = requestAnimationFrame(() => {
        nextFrame.current = requestAnimationFrame(() => {
          const next = previewPageLimit(
            products.length,
            limitRef.current,
            batch,
          );
          limitRef.current = next;
          setLimit(next);
          setLoading(false);
          busy.current = false;
        });
      });
    },
    [pending, products.length, batch],
  );
  useEffect(() => {
    const target = sentinel.current;
    if (!target || !hasMore || pending || !('IntersectionObserver' in window))
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: '100px 0px', threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, limit, pending, loadMore]);
  return (
    <div className="pv-progressive-products">
      <div
        ref={grid}
        className={virtual ? 'pv-virtual-host' : className}
        aria-busy={loading || pending}
      >
        {virtual ? (
          <Suspense
            fallback={
              <div className="pv-product-grid">
                {products.slice(0, limit).map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={onOpen}
                    index={index}
                  />
                ))}
              </div>
            }
          >
            <VirtualProducts
              products={products.slice(0, limit)}
              onOpen={onOpen}
            />
          </Suspense>
        ) : (
          products
            .slice(0, limit)
            .map((product, index) =>
              renderProduct ? (
                renderProduct(product)
              ) : (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={onOpen}
                  index={index}
                />
              ),
            )
        )}
      </div>
      <div ref={sentinel} className="pv-load-more">
        <output aria-live="polite" aria-atomic="true">
          {loading ? (
            <>
              <LoaderCircle className="pv-spin" aria-hidden="true" /> Đang mở
              thêm sản phẩm…
            </>
          ) : (
            `Đã hiển thị ${limit} / ${products.length} sản phẩm`
          )}
        </output>
        {hasMore && (
          <SmoothPreviewButton
            className="pv-button pv-button-outline"
            loading={loading}
            disabled={pending}
            onClick={() => loadMore(true)}
          >
            Xem thêm sản phẩm
            <ArrowDown aria-hidden="true" />
          </SmoothPreviewButton>
        )}
      </div>
    </div>
  );
}

/** Keep below-the-fold information out of the initial render, with a keyboard fallback. */
export function DeferredPreviewSection({
  children,
  sectionKey,
  label,
  className = '',
}: {
  children: ReactNode;
  sectionKey: string;
  label: string;
  className?: string;
}) {
  const memory = useContext(PagingContext);
  const [ready, setReady] = useState(
    () => memory?.sections.has(sectionKey) ?? false,
  );
  const container = useRef<HTMLDivElement>(null);
  const manual = useRef(false);
  useEffect(() => {
    if (ready) {
      memory?.sections.add(sectionKey);
      if (manual.current) {
        container.current?.focus({ preventScroll: true });
        manual.current = false;
      }
      return;
    }
    if (!('IntersectionObserver' in window)) {
      const frame = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '180px 0px' },
    );
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, [ready, memory, sectionKey]);
  return (
    <div
      ref={container}
      tabIndex={-1}
      className={`pv-deferred-section ${className}`}
    >
      {ready ? (
        <div className="pv-section-enter">{children}</div>
      ) : (
        <div className="pv-deferred-placeholder">
          <span className="pv-skeleton" aria-hidden="true" />
          <span className="pv-skeleton" aria-hidden="true" />
          <button
            type="button"
            className="pv-text-button"
            onClick={() => {
              manual.current = true;
              setReady(true);
            }}
          >
            Xem {label}
            <ArrowDown aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
