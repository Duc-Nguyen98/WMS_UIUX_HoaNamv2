'use client';

import {
  lazy,
  Suspense,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  LayoutGrid,
  MessageCircle,
  Phone,
  Search,
  X,
  Menu,
} from 'lucide-react';
import PreviewHome from '@/components/preview-home';
import PreviewScreenBoundary from '@/components/preview-screen-boundary';
import ProductGroupBrowser from '@/components/product-group-browser';
import PreviewCatalog, {
  PreviewSkeleton,
  PreviewModal,
} from '@/components/preview-catalog';
import {
  DEFAULT_PREVIEW_FILTERS,
  PREVIEW_PRODUCTS,
  parsePreviewLocation,
  previewHash,
  previewGroupFilters,
  type PreviewFilters,
  type ProductGroup,
  type PreviewView,
} from '@/lib/product-preview';
import {
  EMPTY_REQUEST,
  rememberAcceptedRequest,
  type SentRequest,
  type RequestState,
} from '@/lib/preview-request';
import {
  PreviewLibraryProvider,
  usePreviewLibrary,
} from '@/components/preview-library-state';
import {
  LIBRARY_LINKS,
  LibraryHome,
  ProductCollection,
  SelectionScreen,
  ComparisonScreen,
  HelpScreen,
  SentRequestsScreen,
} from '@/components/preview-library-screens';
import { knownProductIds } from '@/lib/preview-library';
import './product-preview.css';
import './preview-screens.css';
import './preview-library.css';

const PreviewDetail = lazy(() => import('@/components/preview-detail'));
const PreviewContact = lazy(() => import('@/components/preview-contact'));
const PreviewRequest = lazy(() => import('@/components/preview-request'));
const navigation = [
  { id: 'home', label: 'Trang chủ', icon: Home },
  { id: 'groups', label: 'Danh mục', icon: LayoutGrid },
  { id: 'contact', label: 'Liên hệ', icon: Phone },
] as const;
type Location = ReturnType<typeof parsePreviewLocation>;

export default function ProductPreview() {
  return (
    <PreviewLibraryProvider>
      <PreviewApp />
    </PreviewLibraryProvider>
  );
}
function PreviewApp() {
  const library = usePreviewLibrary();
  const [menu, setMenu] = useState(false);
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const [location, setLocation] = useState<Location>(() =>
    parsePreviewLocation(''),
  );
  const [searchDraft, setSearchDraft] = useState('');
  const [lastGroup, setLastGroup] = useState<ProductGroup>('machine');
  const [requestState, setRequestState] = useState<RequestState>(EMPTY_REQUEST);
  const [keyboard, setKeyboard] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const current = useRef(location);
  const scrollPositions = useRef(new Map<string, number>());
  const productOrigin = useRef<Location | null>(null);
  const requestOrigin = useRef<Location | null>(null);
  const { view, filters, productId } = location;
  const activeGroup = filters.group === 'all' ? lastGroup : filters.group;
  const activeNav = ['catalog', 'search', 'detail'].includes(view)
    ? 'groups'
    : view === 'request'
      ? 'contact'
      : view;
  const selected = PREVIEW_PRODUCTS.find((product) => product.id === productId);
  const visit = library.visit;
  useEffect(() => {
    if (library.ready && view === 'detail' && selected) visit(selected.id);
  }, [library.ready, view, selected, visit]);
  const deferredQuery = useDeferredValue(filters.query);
  const searchPending = deferredQuery !== filters.query;
  const keyOf = (state: Location) =>
    previewHash(state.view, state.filters, state.productId);

  function adopt(next: Location, focus = true) {
    const previous = current.current;
    current.current = next;
    setLocation(next);
    setSearchDraft(next.filters.query);
    if (next.filters.group !== 'all') setLastGroup(next.filters.group);
    if (
      focus &&
      (next.view !== previous.view || next.productId !== previous.productId)
    ) {
      requestAnimationFrame(() => {
        const title = mainRef.current?.querySelector<HTMLElement>('h1');
        if (title && next.view !== 'search') {
          title.tabIndex = -1;
          title.focus({ preventScroll: true });
        } else if (next.view !== 'search') {
          mainRef.current?.focus({ preventScroll: true });
        }
        window.scrollTo({
          top: scrollPositions.current.get(keyOf(next)) ?? 0,
          behavior: 'instant',
        });
      });
    }
  }

  useEffect(() => {
    const originalRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const initial = parsePreviewLocation(window.location.hash);
    if (
      initial.productId &&
      initial.view !== 'detail' &&
      initial.view !== 'request'
    ) {
      productOrigin.current = { ...initial, productId: null };
      initial.view = 'detail';
      window.history.replaceState(null, '', keyOf(initial));
    }
    function syncInitial() {
      current.current = initial;
      setLocation(initial);
      setSearchDraft(initial.filters.query);
      if (initial.filters.group !== 'all') setLastGroup(initial.filters.group);
      if (initial.view === 'request' && initial.productId)
        setRequestState({
          ...EMPTY_REQUEST,
          draft: { ...EMPTY_REQUEST.draft, productIds: [initial.productId] },
        });
    }
    syncInitial();
    const sync = () => {
      scrollPositions.current.set(keyOf(current.current), window.scrollY);
      adopt(parsePreviewLocation(window.location.hash));
    };
    // hashchange also covers native Back/Forward without handling one traversal twice.
    window.addEventListener('hashchange', sync);
    const viewport = window.visualViewport;
    const onViewport = () =>
      setKeyboard(
        Boolean(viewport && window.innerHeight - viewport.height > 140),
      );
    viewport?.addEventListener('resize', onViewport);
    return () => {
      window.history.scrollRestoration = originalRestoration;
      window.removeEventListener('hashchange', sync);
      viewport?.removeEventListener('resize', onViewport);
    };
  }, []);

  function navigate(
    nextView: PreviewView,
    nextFilters = filters,
    nextProductId: string | null = null,
    replace = false,
  ) {
    scrollPositions.current.set(keyOf(current.current), window.scrollY);
    const next = {
      view: nextView,
      filters: nextFilters,
      productId: nextProductId,
    };
    if (keyOf(next) === keyOf(current.current)) return;
    const hash = keyOf(next);
    if (replace) window.history.replaceState(null, '', hash);
    else window.history.pushState(null, '', hash);
    adopt(next);
  }
  function openProduct(id: string) {
    if (view !== 'detail') productOrigin.current = location;
    navigate('detail', filters, id, view === 'detail');
  }
  function backToProducts() {
    const origin = productOrigin.current;
    if (origin) navigate(origin.view, origin.filters, origin.productId, true);
    else navigate('catalog', filters, null, true);
  }
  function openRequest(id?: string) {
    requestOrigin.current = location;
    setRequestState((previous) => ({
      ...previous,
      receipt: null,
      sent: null,
      draft: { ...previous.draft, ...(id ? { productIds: [id] } : {}) },
    }));
    navigate('request', filters, id ?? null);
  }
  function openSelection(ids?: string[]) {
    setRequestState((previous) => ({
      ...previous,
      receipt: null,
      sent: null,
      draft: {
        ...previous.draft,
        productIds: knownProductIds(
          ids ?? previous.draft.productIds,
          PREVIEW_PRODUCTS,
        ),
      },
    }));
    navigate('selection', DEFAULT_PREVIEW_FILTERS);
  }
  function libraryNavigate(nextView: PreviewView) {
    setMenu(false);
    if (nextView === 'selection') openSelection();
    else navigate(nextView, DEFAULT_PREVIEW_FILTERS);
  }
  function changeFilters(next: PreviewFilters) {
    navigate(view, next, null, true);
  }
  function beginSearch() {
    if (view !== 'search')
      navigate('search', { ...DEFAULT_PREVIEW_FILTERS, query: searchDraft });
  }
  function updateQuery(query: string) {
    setSearchDraft(query);
    if (view === 'search')
      navigate('search', { ...filters, query }, null, true);
  }
  const showSearch = ['home', 'groups', 'catalog', 'search'].includes(view);
  return (
    <div
      className={`pv-theme pv-app${view === 'detail' ? ' pv-has-detail-cta' : ''}${keyboard ? ' pv-keyboard-open' : ''}`}
    >
      <a
        className="pv-skip"
        href="#pv-main"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Đến nội dung chính
      </a>
      <header className="pv-header">
        <div className="pv-header-inner">
          <a
            href="#view=home"
            className="pv-wordmark"
            aria-label="Xem sản phẩm — về trang chủ"
            onClick={(event) => {
              event.preventDefault();
              navigate('home', DEFAULT_PREVIEW_FILTERS);
            }}
          >
            <span>HOA NAM</span>
            <strong>
              Xem sản phẩm<span className="pv-wordmark-dot">.</span>
            </strong>
          </a>
          <nav className="pv-desktop-nav" aria-label="Điều hướng chính">
            {navigation.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={previewHash(
                  id,
                  id === 'groups'
                    ? previewGroupFilters(activeGroup)
                    : DEFAULT_PREVIEW_FILTERS,
                )}
                aria-current={activeNav === id ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(
                    id,
                    id === 'groups'
                      ? previewGroupFilters(activeGroup)
                      : DEFAULT_PREVIEW_FILTERS,
                  );
                }}
              >
                <Icon aria-hidden="true" />
                {label}
              </a>
            ))}
          </nav>
          <button
            className="pv-icon-button pv-library-menu-button"
            aria-label="Mở tiện ích sản phẩm"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
          >
            <Menu aria-hidden="true" />
          </button>
          <a
            className="pv-header-support"
            href="#view=contact"
            onClick={(event) => {
              event.preventDefault();
              navigate('contact', DEFAULT_PREVIEW_FILTERS);
            }}
          >
            <MessageCircle aria-hidden="true" />
            <span>Tư vấn</span>
          </a>
        </div>
      </header>
      <main className="pv-main" id="pv-main" ref={mainRef} tabIndex={-1}>
        {library.notice && (
          <div className="pv-library-notice">
            <output>{library.notice}</output>
            <button
              className="pv-text-button"
              onClick={() => libraryNavigate('compare')}
            >
              Mở so sánh
            </button>
            <button
              className="pv-icon-button"
              aria-label="Đóng thông báo"
              onClick={library.dismissNotice}
            >
              <X aria-hidden="true" />
            </button>
          </div>
        )}
        {showSearch && (
          <search
            className={view === 'search' ? 'pv-search-screen-input' : undefined}
          >
            <form
              className="pv-search"
              onSubmit={(event) => {
                event.preventDefault();
                searchRef.current?.blur();
                navigate(
                  'search',
                  { ...DEFAULT_PREVIEW_FILTERS, query: searchDraft.trim() },
                  null,
                  view === 'search',
                );
              }}
            >
              {view === 'search' ? (
                <button
                  type="button"
                  className="pv-icon-button"
                  aria-label="Quay lại danh mục"
                  onClick={() => navigate('catalog', DEFAULT_PREVIEW_FILTERS)}
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
              ) : (
                <Search aria-hidden="true" />
              )}
              <label htmlFor="pv-search" className="sr-only">
                Tìm theo tên sản phẩm, model hoặc công dụng
              </label>
              <input
                ref={searchRef}
                id="pv-search"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Tìm tên sản phẩm, model hoặc công dụng"
                value={searchDraft}
                onFocus={beginSearch}
                onChange={(event) => updateQuery(event.target.value)}
              />
              {searchDraft && (
                <button
                  type="button"
                  className="pv-icon-button"
                  aria-label="Xóa từ khóa"
                  onClick={() => {
                    updateQuery('');
                    searchRef.current?.focus();
                  }}
                >
                  <X aria-hidden="true" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Tìm kiếm sản phẩm"
                className="pv-button pv-search-submit"
              >
                <span>Tìm kiếm</span>
                <ArrowRight aria-hidden="true" />
              </button>
            </form>
          </search>
        )}
        <PreviewScreenBoundary key={view}>
          <Suspense fallback={<PreviewSkeleton detail={view === 'detail'} />}>
            {view === 'home' && (
              <>
                <PreviewHome
                  navigate={navigate}
                  headingRef={headingRef}
                  activeGroup={activeGroup}
                />
                <LibraryHome navigate={libraryNavigate} onOpen={openProduct} />
                <PreviewCatalog
                  mode="home"
                  filters={filters}
                  onChange={changeFilters}
                  onOpen={openProduct}
                  onBack={() =>
                    navigate('groups', previewGroupFilters(activeGroup))
                  }
                />
                <div className="pv-more">
                  <button
                    className="pv-button pv-button-outline"
                    onClick={() => navigate('catalog', filters)}
                  >
                    Xem toàn bộ danh mục
                    <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
            {view === 'groups' && (
              <ProductGroupBrowser
                group={activeGroup}
                headingRef={headingRef}
                onGroupChange={(group) =>
                  navigate('groups', previewGroupFilters(group), null, true)
                }
                onOpenCategory={(group, category) =>
                  navigate('catalog', previewGroupFilters(group, category))
                }
                onContact={() => navigate('contact', filters)}
              />
            )}
            {(view === 'catalog' || view === 'search') && (
              <div aria-busy={searchPending}>
                {searchPending && (
                  <output className="pv-search-progress">
                    Đang tìm sản phẩm…
                  </output>
                )}
                <PreviewCatalog
                  mode={view}
                  filters={{ ...filters, query: deferredQuery }}
                  onChange={changeFilters}
                  onOpen={openProduct}
                  onBack={() =>
                    navigate('groups', previewGroupFilters(activeGroup))
                  }
                />
              </div>
            )}
            {view === 'detail' && (
              <PreviewDetail
                key={productId}
                product={selected}
                onBack={backToProducts}
                onRequest={openRequest}
                onOpen={openProduct}
                onContact={() => navigate('contact', filters)}
              />
            )}
            {view === 'contact' && (
              <PreviewContact
                onRequest={() => openRequest()}
                onBrowse={() => navigate('catalog', DEFAULT_PREVIEW_FILTERS)}
              />
            )}
            {(view === 'recent' || view === 'saved') && (
              <ProductCollection
                kind={view}
                navigate={libraryNavigate}
                onOpen={openProduct}
                onRequest={openSelection}
              />
            )}
            {view === 'help' && <HelpScreen navigate={libraryNavigate} />}
            {view === 'compare' && (
              <ComparisonScreen
                navigate={libraryNavigate}
                onOpen={openProduct}
                onRequest={openSelection}
              />
            )}
            {view === 'selection' && (
              <SelectionScreen
                ids={requestState.draft.productIds}
                onChange={(productIds) =>
                  setRequestState((previous) => ({
                    ...previous,
                    draft: { ...previous.draft, productIds },
                  }))
                }
                onContinue={() => openRequest()}
                navigate={libraryNavigate}
              />
            )}
            {view === 'requests' && (
              <SentRequestsScreen
                records={sentRequests}
                onClear={() => {
                  setSentRequests([]);
                  setRequestState((previous) => ({
                    ...previous,
                    receipt: null,
                    sent: null,
                  }));
                }}
                navigate={libraryNavigate}
              />
            )}
            {view === 'request' && (
              <PreviewRequest
                state={requestState}
                onChange={setRequestState}
                onEditProducts={() => openSelection()}
                onAccepted={(record) =>
                  setSentRequests((records) =>
                    rememberAcceptedRequest(records, record),
                  )
                }
                onHistory={() => libraryNavigate('requests')}
                onBack={() => {
                  const origin = requestOrigin.current;
                  if (origin)
                    navigate(
                      origin.view,
                      origin.filters,
                      origin.productId,
                      true,
                    );
                  else navigate('contact', filters, null, true);
                }}
                onBrowse={() => navigate('catalog', DEFAULT_PREVIEW_FILTERS)}
              />
            )}
          </Suspense>
        </PreviewScreenBoundary>
      </main>
      {menu && (
        <PreviewModal
          title="Tiện ích sản phẩm"
          description="Tiếp tục xem, lựa chọn và kết nối với Hoa Nam."
          onClose={() => setMenu(false)}
        >
          <nav className="pv-library-menu" aria-label="Tiện ích sản phẩm">
            {LIBRARY_LINKS.map(({ view: target, label, icon: Icon }) => (
              <button
                key={target}
                aria-current={view === target ? 'page' : undefined}
                onClick={() => libraryNavigate(target)}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
                {target === 'saved' && library.saved.length > 0 && (
                  <small>{library.saved.length}</small>
                )}
                {target === 'compare' && library.compared.length > 0 && (
                  <small>{library.compared.length}/3</small>
                )}
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </nav>
        </PreviewModal>
      )}
      {view !== 'detail' && (
        <nav
          className="pv-mobile-nav"
          aria-label="Điều hướng chính trên điện thoại"
        >
          {navigation.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={previewHash(
                id,
                id === 'groups'
                  ? previewGroupFilters(activeGroup)
                  : DEFAULT_PREVIEW_FILTERS,
              )}
              aria-current={activeNav === id ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigate(
                  id,
                  id === 'groups'
                    ? previewGroupFilters(activeGroup)
                    : DEFAULT_PREVIEW_FILTERS,
                );
              }}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
