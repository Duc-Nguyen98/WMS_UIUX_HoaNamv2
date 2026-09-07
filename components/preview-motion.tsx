'use client';
import {
  LazyMotion,
  domAnimation,
  MotionConfig,
  m,
  useReducedMotion,
  AnimatePresence,
  type HTMLMotionProps,
} from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import type LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/locomotive-scroll.css';

export function PreviewMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

export function PreviewScreenMotion({
  children,
  search = false,
}: {
  children: ReactNode;
  search?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={`pv-screen-enter${search ? ' pv-search-results' : ''}`}
      initial={search || reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: search || reduced ? 0 : 0.16 }}
    >
      {children}
    </m.div>
  );
}

/** Manual adaptation of SmoothUI's smooth-button registry primitive (Eduardo Calvo).
 * Retains native button semantics, reduced motion and animated loading slot;
 * uses the existing Hoa Nam tokens and 44px+ targets instead of registry theme/size defaults.
 * Source: https://smoothui.dev/r/smooth-button.json
 */
export function SmoothPreviewButton({
  children,
  loading = false,
  disabled,
  ...props
}: Omit<HTMLMotionProps<'button'>, 'children'> & {
  children?: ReactNode;
  loading?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <m.button
      type="button"
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-pv-motion="button"
      whileTap={reduced || disabled || loading ? undefined : { scale: 0.98 }}
      transition={{ duration: reduced ? 0 : 0.16 }}
    >
      <AnimatePresence initial={false}>
        {loading && (
          <m.span
            className="pv-button-spinner"
            key="spinner"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.16 }}
          >
            <span className="pv-css-spinner" />
          </m.span>
        )}
      </AnimatePresence>
      {children}
    </m.button>
  );
}

/** Locomotive v5 owns its single Lenis instance. Touch remains native. */
export function PreviewScrollController({ route }: { route: string }) {
  const reduced = useReducedMotion();
  const scroll = useRef<LocomotiveScroll | null>(null);
  useEffect(() => {
    if (reduced !== false) return;
    let disposed = false;
    const reset = () =>
      scroll.current?.lenisInstance?.scrollTo(window.scrollY, {
        immediate: true,
        force: true,
      });
    const reveal = (event: Event) => {
      const target = (event as CustomEvent<HTMLElement>).detail;
      if (!target?.isConnected || !scroll.current) return;
      event.preventDefault();
      const bounds = target.getBoundingClientRect();
      if (bounds.top < 90 || bounds.bottom > window.innerHeight - 90)
        scroll.current.scrollTo(window.scrollY + bounds.top - 100, {
          duration: 0.3,
        });
    };
    import('locomotive-scroll')
      .then(({ default: Locomotive }) => {
        if (disposed) return;
        scroll.current = new Locomotive({
          lenisOptions: {
            smoothWheel: false,
            syncTouch: false,
            duration: 0.3,
            anchors: false,
            prevent: (node) =>
              Boolean(
                node.closest(
                  '[role="dialog"], input, textarea, select, [data-lenis-prevent]',
                ),
              ),
          },
        });
        // Smooth only deliberate in-app reveal actions; do not intercept finger momentum.
        window.addEventListener('pv:scroll-sync', reset);
        window.addEventListener('pv:reveal', reveal);
      })
      .catch(() => {
        /* Native scrolling remains available if optional code cannot load. */
      });
    return () => {
      disposed = true;
      window.removeEventListener('pv:scroll-sync', reset);
      window.removeEventListener('pv:reveal', reveal);
      scroll.current?.destroy();
      scroll.current = null;
    };
  }, [reduced]);
  useEffect(() => {
    scroll.current?.resize();
    scroll.current?.lenisInstance?.scrollTo(window.scrollY, {
      immediate: true,
      force: true,
    });
  }, [route]);
  return null;
}

export function revealPreviewElement(element: HTMLElement) {
  const event = new CustomEvent('pv:reveal', {
    detail: element,
    cancelable: true,
  });
  if (window.dispatchEvent(event))
    element.scrollIntoView({
      block: 'nearest',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
}
