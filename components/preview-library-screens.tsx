'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Heart,
  GitCompareArrows,
  ListPlus,
  Package,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import {
  DEFAULT_PREVIEW_FILTERS,
  PREVIEW_PRODUCTS,
  PREVIEW_CATEGORIES,
  filterPreviewProducts,
  type PreviewView,
} from '@/lib/product-preview';
import { usePreviewLibrary } from '@/components/preview-library-state';
import {
  ProductCard,
  ProductPhoto,
  AvailabilityBadge,
} from '@/components/preview-products';
import { ContactLinks } from '@/components/preview-contact';
import { PreviewModal } from '@/components/preview-catalog';
import type { SentRequest } from '@/lib/preview-request';
import { ProgressiveProducts } from '@/components/preview-progressive';

export const LIBRARY_LINKS = [
  { view: 'recent', label: 'Sản phẩm đã xem', short: 'Đã xem', icon: Clock3 },
  { view: 'saved', label: 'Sản phẩm đã lưu', short: 'Đã lưu', icon: Heart },
  {
    view: 'selection',
    label: 'Yêu cầu nhiều sản phẩm',
    short: 'Chọn sản phẩm',
    icon: ListPlus,
  },
  {
    view: 'compare',
    label: 'So sánh sản phẩm',
    short: 'So sánh',
    icon: GitCompareArrows,
  },
  {
    view: 'requests',
    label: 'Yêu cầu đã gửi',
    short: 'Yêu cầu đã gửi',
    icon: Send,
  },
  {
    view: 'help',
    label: 'Hướng dẫn & câu hỏi',
    short: 'Hướng dẫn',
    icon: BookOpen,
  },
] as const;
type Navigate = (view: PreviewView) => void;
export function ProductUtilities({
  activeView,
  navigate,
  requestCount,
}: {
  activeView: PreviewView;
  navigate: Navigate;
  requestCount: number;
}) {
  const library = usePreviewLibrary();
  const groups = [
    { title: 'Xem lại', views: ['recent', 'saved'] },
    { title: 'Lựa chọn & tư vấn', views: ['compare', 'selection'] },
    { title: 'Hỗ trợ', views: ['requests', 'help'] },
  ];
  return (
    <nav className="pv-library-menu" aria-label="Tiện ích sản phẩm">
      {groups.map((group) => (
        <section
          className="pv-utility-group"
          key={group.title}
          aria-label={group.title}
        >
          <h3>{group.title}</h3>
          <div
            className={
              group.title === 'Hỗ trợ' ? 'pv-utility-rows' : 'pv-utility-grid'
            }
          >
            {group.views.map((target) => {
              const item = LIBRARY_LINKS.find((link) => link.view === target)!;
              const Icon = item.icon;
              const count =
                target === 'saved'
                  ? library.saved.length
                  : target === 'recent'
                    ? library.recent.length
                    : target === 'compare'
                      ? library.compared.length
                      : target === 'requests'
                        ? requestCount
                        : 0;
              return (
                <button
                  key={target}
                  aria-label={item.label}
                  aria-current={activeView === target ? 'page' : undefined}
                  onClick={() => navigate(item.view)}
                >
                  <span className="pv-utility-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="pv-utility-label">
                    {target === 'selection'
                      ? 'Yêu cầu nhiều sản phẩm'
                      : item.short}
                  </span>
                  {count > 0 && (
                    <small className="pv-utility-count">
                      {count}
                      {target === 'compare' ? '/3' : ''}
                    </small>
                  )}
                  <ChevronRight
                    className="pv-utility-arrow"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}

function ScreenHeading({
  title,
  description,
  navigate,
}: {
  title: string;
  description: string;
  navigate: Navigate;
}) {
  return (
    <div className="pv-library-heading">
      <button className="pv-back-to-groups" onClick={() => navigate('home')}>
        <ArrowLeft aria-hidden="true" />
        Trang chủ
      </button>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
function EmptyCollection({
  title,
  text,
  navigate,
}: {
  title: string;
  text: string;
  navigate: Navigate;
}) {
  return (
    <div className="pv-empty">
      <Package aria-hidden="true" />
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="pv-button" onClick={() => navigate('catalog')}>
        Khám phá sản phẩm <ArrowRight aria-hidden="true" />
      </button>
    </div>
  );
}
const resolveProducts = (ids: readonly string[]) =>
  ids.flatMap((id) => {
    const product = PREVIEW_PRODUCTS.find((item) => item.id === id);
    return product ? [product] : [];
  });

export function LibraryHome({
  navigate,
  onOpen,
}: {
  navigate: Navigate;
  onOpen: (id: string) => void;
}) {
  const library = usePreviewLibrary();
  const products = resolveProducts(library.recent).slice(0, 4);
  return (
    <section
      className="pv-section pv-library-home"
      aria-label="Sản phẩm của bạn"
    >
      <div className="pv-library-shortcuts">
        {LIBRARY_LINKS.filter((item) =>
          ['recent', 'saved', 'help'].includes(item.view),
        ).map(({ view, label, icon: Icon }) => (
          <button key={view} onClick={() => navigate(view)}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
            <ChevronRight aria-hidden="true" />
          </button>
        ))}
      </div>
      {products.length > 0 && (
        <>
          <div className="pv-section-heading">
            <h2>Sản phẩm vừa xem</h2>
            <button
              className="pv-text-button"
              onClick={() => navigate('recent')}
            >
              Xem tất cả <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <div className="pv-product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={onOpen} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export function ProductCollection({
  kind,
  navigate,
  onOpen,
  onRequest,
}: {
  kind: 'recent' | 'saved';
  navigate: Navigate;
  onOpen: (id: string) => void;
  onRequest: (ids: string[]) => void;
}) {
  const library = usePreviewLibrary();
  const [clear, setClear] = useState(false);
  const products = resolveProducts(library[kind]);
  const isSaved = kind === 'saved';
  return (
    <section className="pv-library-screen">
      <ScreenHeading
        title={isSaved ? 'Sản phẩm đã lưu' : 'Sản phẩm đã xem'}
        description={
          isSaved
            ? 'Giữ lại sản phẩm quan tâm để xem và gửi yêu cầu khi bạn cần.'
            : 'Tiếp tục tìm hiểu những sản phẩm bạn vừa quan tâm.'
        }
        navigate={navigate}
      />
      <p className="pv-device-note">
        {library.persistent
          ? 'Danh sách được lưu trong trình duyệt trên thiết bị này, không đồng bộ sang thiết bị khác. Xóa dữ liệu trình duyệt sẽ xóa danh sách.'
          : 'Trình duyệt chưa cho phép lưu danh sách. Các lựa chọn chỉ được giữ trong lần mở trang này.'}
      </p>
      <div className="pv-library-toolbar">
        <span>{products.length} sản phẩm</span>
        {products.length > 0 &&
          (isSaved ? (
            <button
              className="pv-button"
              onClick={() => onRequest(products.map((item) => item.id))}
            >
              Gửi yêu cầu cho danh sách <ArrowRight aria-hidden="true" />
            </button>
          ) : (
            <button className="pv-text-button" onClick={() => setClear(true)}>
              <Trash2 aria-hidden="true" />
              Xóa lịch sử xem
            </button>
          ))}
      </div>
      {!library.ready ? (
        <output>Đang mở danh sách…</output>
      ) : products.length ? (
        <ProgressiveProducts
          products={products}
          scope={`library:${kind}`}
          onOpen={onOpen}
        />
      ) : (
        <EmptyCollection
          title={
            isSaved ? 'Bạn chưa lưu sản phẩm nào' : 'Bạn chưa xem sản phẩm nào'
          }
          text={
            isSaved
              ? 'Chạm “Lưu” trên sản phẩm để tìm lại tại đây.'
              : 'Mở một sản phẩm trong danh mục để bắt đầu.'
          }
          navigate={navigate}
        />
      )}
      {clear && (
        <PreviewModal
          title="Xóa lịch sử xem?"
          description="Danh sách đã lưu vẫn được giữ nguyên."
          onClose={() => setClear(false)}
        >
          <div className="pv-library-actions">
            <button
              className="pv-button pv-button-outline"
              onClick={() => setClear(false)}
            >
              Giữ lại
            </button>
            <button
              className="pv-button"
              onClick={() => {
                library.clearRecent();
                setClear(false);
              }}
            >
              Xóa lịch sử xem
            </button>
          </div>
        </PreviewModal>
      )}
    </section>
  );
}

export function SelectionScreen({
  ids,
  onChange,
  onContinue,
  navigate,
}: {
  ids: string[];
  onChange: (ids: string[]) => void;
  onContinue: () => void;
  navigate: Navigate;
}) {
  const [query, setQuery] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);
  const library = usePreviewLibrary();
  const chosen = resolveProducts(ids);
  const matches = filterPreviewProducts(PREVIEW_PRODUCTS, {
    ...DEFAULT_PREVIEW_FILTERS,
    query,
  }).filter((item) => !onlySaved || library.saved.includes(item.id));
  const toggle = (id: string) =>
    onChange(
      ids.includes(id) ? ids.filter((entry) => entry !== id) : [...ids, id],
    );
  return (
    <section className="pv-library-screen">
      <ScreenHeading
        title="Yêu cầu nhiều sản phẩm"
        description="Chọn sản phẩm bạn quan tâm, sau đó để lại thông tin để được tư vấn cùng một lần."
        navigate={navigate}
      />
      <div className="pv-selection-layout">
        <div className="pv-selection-catalog">
          <label className="pv-library-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Tìm sản phẩm để thêm vào yêu cầu</span>
            <input
              type="search"
              placeholder="Tìm tên sản phẩm hoặc model"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="pv-library-toolbar">
            <h2>Chọn sản phẩm</h2>
            <button
              className="pv-choice-chip"
              aria-pressed={onlySaved}
              onClick={() => setOnlySaved(!onlySaved)}
            >
              <Heart aria-hidden="true" />
              Đã lưu
            </button>
          </div>
          <div className="pv-pick-list">
            {matches.map((product) => (
              <label
                key={product.id}
                className={`pv-pick-row${ids.includes(product.id) ? ' is-selected' : ''}`}
              >
                <ProductPhoto crop={product.image} label={product.name} />
                <span className="pv-pick-copy">
                  <strong>{product.model}</strong>
                  <span>{product.name}</span>
                  <AvailabilityBadge value={product.availability} />
                </span>
                <input
                  type="checkbox"
                  checked={ids.includes(product.id)}
                  onChange={() => toggle(product.id)}
                  aria-label={`Chọn ${product.model}`}
                />
              </label>
            ))}
          </div>
          {!matches.length && (
            <div className="pv-empty">
              <Search aria-hidden="true" />
              <h2>
                {onlySaved && !library.saved.length
                  ? 'Bạn chưa lưu sản phẩm nào'
                  : 'Không tìm thấy sản phẩm'}
              </h2>
              <button
                className="pv-text-button"
                onClick={() => {
                  setOnlySaved(false);
                  setQuery('');
                }}
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
        <aside className="pv-selection-summary">
          <h2>
            Danh sách yêu cầu <span>{chosen.length}</span>
          </h2>
          <p>Rà soát sản phẩm trước khi tiếp tục.</p>
          {chosen.length ? (
            <ul>
              {chosen.map((product) => (
                <li key={product.id}>
                  <span>
                    <strong>{product.model}</strong>
                    {product.name}
                  </span>
                  <button
                    className="pv-icon-button"
                    aria-label={`Bỏ ${product.model} khỏi yêu cầu`}
                    onClick={() => toggle(product.id)}
                  >
                    <X aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pv-device-note">
              Chọn ít nhất một sản phẩm từ danh sách.
            </p>
          )}
          <button
            className="pv-button"
            disabled={!chosen.length}
            onClick={onContinue}
          >
            Tiếp tục với {chosen.length} sản phẩm{' '}
            <ArrowRight aria-hidden="true" />
          </button>
          <small>Bạn có thể chỉnh sửa trước khi gửi.</small>
        </aside>
      </div>
    </section>
  );
}

export function ComparisonScreen({
  navigate,
  onOpen,
  onRequest,
}: {
  navigate: Navigate;
  onOpen: (id: string) => void;
  onRequest: (ids: string[]) => void;
}) {
  const library = usePreviewLibrary();
  const products = resolveProducts(library.compared);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [category, setCategory] = useState(
    PREVIEW_CATEGORIES.find(
      (item) =>
        PREVIEW_PRODUCTS.filter((product) => product.category === item.id)
          .length >= 2,
    )?.id ?? PREVIEW_PRODUCTS[0].category,
  );
  const activeCategory = products[0]?.category ?? category;
  const categoryName = PREVIEW_CATEGORIES.find(
    (item) => item.id === activeCategory,
  )?.name;
  const candidates = PREVIEW_PRODUCTS.filter(
    (item) =>
      item.category === activeCategory && !library.compared.includes(item.id),
  );
  const specLabels = [
    ...new Set(
      products.flatMap(
        (item) => item.specifications?.map((spec) => spec.label) ?? [],
      ),
    ),
  ];
  const picker = (
    <div className="pv-compare-options">
      {candidates.map((product) => (
        <button
          key={product.id}
          aria-label={`Thêm ${product.model} vào so sánh`}
          onClick={() => {
            library.compare(product.id);
            setPickerOpen(false);
          }}
        >
          <ProductPhoto crop={product.image} label={product.name} />
          <span>
            <strong>{product.model}</strong>
            {product.name}
          </span>
          <ListPlus aria-hidden="true" />
        </button>
      ))}
      {!candidates.length && (
        <p className="pv-device-note">
          Chưa có model khác trong danh mục này để so sánh.
        </p>
      )}
    </div>
  );
  return (
    <section className="pv-library-screen pv-compare-screen">
      <ScreenHeading
        title="So sánh sản phẩm"
        description="Chọn 2–3 model cùng danh mục. Xem từng tiêu chí để tìm sản phẩm phù hợp."
        navigate={navigate}
      />
      <div className="pv-library-toolbar pv-compare-toolbar">
        <output>{products.length}/3 sản phẩm đã chọn</output>
        {products.length > 0 && (
          <button className="pv-text-button" onClick={library.clearComparison}>
            <Trash2 aria-hidden="true" /> Xóa lựa chọn
          </button>
        )}
      </div>
      {!products.length ? (
        <div className="pv-compare-picker">
          <label className="pv-compare-category">
            Danh mục so sánh
            <select
              value={activeCategory}
              onChange={(event) =>
                setCategory(event.target.value as typeof category)
              }
            >
              {PREVIEW_CATEGORIES.filter((item) =>
                PREVIEW_PRODUCTS.some(
                  (product) => product.category === item.id,
                ),
              ).map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <h2>Chọn model đầu tiên</h2>
          {picker}
        </div>
      ) : (
        <>
          <p className="pv-compare-category-name">{categoryName}</p>
          <div className="pv-compare-roster" aria-label="Sản phẩm đang so sánh">
            {products.map((product) => (
              <article className="pv-compare-card" key={product.id}>
                <button
                  className="pv-compare-open"
                  aria-label={`Xem chi tiết ${product.model}`}
                  onClick={() => onOpen(product.id)}
                >
                  <ProductPhoto crop={product.image} label={product.name} />
                  <span className="pv-compare-card-copy">
                    <strong>{product.model}</strong>
                    <span>{product.name}</span>
                    <AvailabilityBadge value={product.availability} />
                  </span>
                </button>
                <button
                  className="pv-icon-button pv-compare-remove"
                  aria-label={`Bỏ ${product.model} khỏi so sánh`}
                  onClick={() => library.compare(product.id)}
                >
                  <X aria-hidden="true" />
                </button>
                <button
                  className="pv-text-button pv-compare-one-request"
                  aria-label={`Gửi yêu cầu cho ${product.model}`}
                  onClick={() => onRequest([product.id])}
                >
                  Tư vấn model này <ArrowRight aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
          {products.length < 3 && (
            <button
              className="pv-compare-add"
              onClick={() => setPickerOpen(true)}
            >
              <ListPlus aria-hidden="true" />
              {products.length === 1
                ? 'Chọn model thứ hai'
                : 'Thêm model thứ ba'}
            </button>
          )}
          {products.length === 1 ? (
            <p className="pv-device-note">
              Chọn thêm một model cùng danh mục để đối chiếu.
            </p>
          ) : (
            <div className="pv-compare-features">
              <section
                className="pv-compare-feature"
                aria-labelledby="pv-compare-use"
              >
                <h2 id="pv-compare-use">Công dụng & đặc điểm</h2>
                {products.some((product) => product.description) ? (
                  <dl>
                    {products.map((product) => (
                      <div className="pv-compare-value" key={product.id}>
                        <dt>{product.model}</dt>
                        <dd>
                          {product.description ||
                            'Chưa có thông tin công dụng.'}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="pv-compare-missing">
                    Chưa có thông tin công dụng để đối chiếu. Hoa Nam sẽ tư vấn
                    theo nhu cầu của bạn.
                  </p>
                )}
              </section>
              <section
                className="pv-compare-feature"
                aria-labelledby="pv-compare-specs"
              >
                <h2 id="pv-compare-specs">Thông số kỹ thuật</h2>
                {specLabels.length ? (
                  specLabels.map((label) => (
                    <div className="pv-compare-spec" key={label}>
                      <h3>{label}</h3>
                      <dl>
                        {products.map((product) => (
                          <div className="pv-compare-value" key={product.id}>
                            <dt>{product.model}</dt>
                            <dd>
                              {product.specifications?.find(
                                (spec) => spec.label === label,
                              )?.value ?? 'Chưa có thông tin'}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))
                ) : (
                  <p className="pv-compare-missing">
                    Chưa có thông số để đối chiếu giữa các model. Gửi yêu cầu để
                    được tư vấn chi tiết.
                  </p>
                )}
              </section>
            </div>
          )}
          <div className="pv-compare-actions">
            <button
              className="pv-button"
              onClick={() => onRequest(products.map((item) => item.id))}
            >
              Tư vấn {products.length} sản phẩm{' '}
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </>
      )}
      {pickerOpen && products.length > 0 && products.length < 3 && (
        <PreviewModal
          className="pv-compare-picker-sheet"
          title="Thêm sản phẩm so sánh"
          description={`Các model thuộc ${categoryName?.toLowerCase() ?? 'cùng danh mục'}.`}
          onClose={() => setPickerOpen(false)}
        >
          {picker}
        </PreviewModal>
      )}
    </section>
  );
}

const QUESTIONS = [
  {
    title: 'Tôi có cần đăng nhập để xem và gửi yêu cầu không?',
    text: 'Bạn có thể xem danh mục, tìm sản phẩm và gửi yêu cầu tư vấn mà không cần tạo tài khoản hoặc đăng nhập.',
  },
  {
    title: '“Sẵn hàng” và “Đặt trước” khác nhau thế nào?',
    text: '“Sẵn hàng” là sản phẩm được giới thiệu ở trạng thái có sẵn. “Đặt trước” cho phép bạn để lại nhu cầu để được tư vấn khả năng cung cấp. Nhân viên tư vấn sẽ xác nhận khả năng đáp ứng trước khi bạn chốt đặt hàng.',
  },
  {
    title: 'Làm thế nào để gửi yêu cầu cho nhiều sản phẩm?',
    text: 'Mở “Yêu cầu nhiều sản phẩm”, chọn các model quan tâm rồi bấm “Tiếp tục”. Kiểm tra danh sách, nhập họ tên, số điện thoại và ghi chú nếu cần trước khi gửi.',
  },
  {
    title: 'Gửi yêu cầu có nghĩa là đã chốt đơn hàng chưa?',
    text: 'Yêu cầu giúp Hoa Nam tiếp nhận nhu cầu và liên hệ tư vấn. Bạn sẽ trao đổi với nhân viên tư vấn để thống nhất thông tin đặt hàng.',
  },
  {
    title: 'Tôi chưa gửi được yêu cầu, nên làm gì?',
    text: 'Giữ trang đang mở để không mất nội dung đã nhập. Kiểm tra thông tin, thử gửi lại hoặc gọi hotline để được hỗ trợ.',
  },
  {
    title: 'Tôi có thể xem lại sản phẩm đã lưu ở thiết bị khác không?',
    text: 'Danh sách đã xem và đã lưu nằm trong trình duyệt trên thiết bị bạn đang dùng. Danh sách không đồng bộ sang thiết bị khác và sẽ mất khi bạn xóa dữ liệu trình duyệt.',
  },
  {
    title: 'Thông tin liên hệ của tôi được dùng để làm gì?',
    text: 'Họ tên, số điện thoại, sản phẩm và ghi chú được dùng để tiếp nhận nhu cầu và liên hệ tư vấn sản phẩm. Chỉ cung cấp những thông tin cần thiết cho việc tư vấn.',
  },
];
export function HelpScreen({ navigate }: { navigate: Navigate }) {
  return (
    <section className="pv-library-screen pv-help-screen">
      <ScreenHeading
        title="Hướng dẫn & câu hỏi thường gặp"
        description="Tìm sản phẩm, gửi nhu cầu và kết nối với Hoa Nam."
        navigate={navigate}
      />
      <ol className="pv-help-steps">
        {[
          'Tìm sản phẩm phù hợp',
          'Chọn sản phẩm quan tâm',
          'Gửi thông tin cần tư vấn',
        ].map((text, index) => (
          <li key={text}>
            <span>{index + 1}</span>
            <strong>{text}</strong>
          </li>
        ))}
      </ol>
      <div className="pv-faq">
        {QUESTIONS.map((question) => (
          <details key={question.title}>
            <summary>
              {question.title}
              <ChevronRight aria-hidden="true" />
            </summary>
            <p>{question.text}</p>
          </details>
        ))}
      </div>
      <div className="pv-help-contact">
        <BookOpen aria-hidden="true" />
        <div>
          <h2>Bạn cần hỗ trợ thêm?</h2>
          <p>
            Gửi sản phẩm quan tâm hoặc trao đổi trực tiếp với nhân viên tư vấn.
          </p>
        </div>
        <button className="pv-button" onClick={() => navigate('selection')}>
          Chọn sản phẩm <ArrowRight aria-hidden="true" />
        </button>
        <ContactLinks />
      </div>
    </section>
  );
}

export function SentRequestsScreen({
  records,
  onClear,
  navigate,
}: {
  records: SentRequest[];
  onClear: () => void;
  navigate: Navigate;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [clear, setClear] = useState(false);
  const [copyState, setCopyState] = useState('');
  const item = records.find((record) => record.receipt.requestId === selected);
  const copy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopyState('Đã sao chép mã yêu cầu.');
    } catch {
      setCopyState('Chưa sao chép được. Bạn có thể chọn mã để sao chép.');
    }
  };
  return (
    <section className="pv-library-screen pv-sent-screen">
      <ScreenHeading
        title="Yêu cầu đã gửi"
        description="Xem lại nội dung yêu cầu đã được tiếp nhận trong lần mở trang này."
        navigate={navigate}
      />
      <p className="pv-device-note">
        Để giữ riêng tư thông tin liên hệ, danh sách này không được lưu trên
        thiết bị. Khi tải lại hoặc đóng trang, thông tin sẽ không còn hiển thị
        tại đây. Hãy lưu mã yêu cầu để liên hệ tư vấn khi cần.
      </p>
      <div className="pv-library-toolbar">
        <span>{records.length} yêu cầu</span>
        {records.length > 0 && (
          <button className="pv-text-button" onClick={() => setClear(true)}>
            <Trash2 aria-hidden="true" />
            Xóa khỏi màn hình này
          </button>
        )}
      </div>
      {!records.length ? (
        <div className="pv-empty">
          <Send aria-hidden="true" />
          <h2>Chưa có yêu cầu để xem lại</h2>
          <p>
            Yêu cầu xuất hiện tại đây sau khi được tiếp nhận thành công trong
            lần mở trang này.
          </p>
          <button className="pv-button" onClick={() => navigate('selection')}>
            Chọn sản phẩm để gửi yêu cầu <ArrowRight aria-hidden="true" />
          </button>
          <ContactLinks />
        </div>
      ) : (
        <div className="pv-sent-list">
          {records.map((record) => (
            <button
              key={record.receipt.requestId}
              onClick={() => {
                setSelected(record.receipt.requestId);
                setCopyState('');
              }}
            >
              <span className="pv-sent-icon">
                <Check aria-hidden="true" />
              </span>
              <span>
                <strong>{record.receipt.requestId}</strong>
                <span>
                  {record.products.map((product) => product.model).join(' · ')}
                </span>
                <small>Đã tiếp nhận · {record.products.length} sản phẩm</small>
              </span>
              <ChevronRight aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
      {item && (
        <PreviewModal
          title="Chi tiết yêu cầu đã gửi"
          description={`Mã yêu cầu: ${item.receipt.requestId}`}
          onClose={() => setSelected(null)}
        >
          <div className="pv-sent-detail">
            <p className="pv-stock pv-stock-ready">
              <Check aria-hidden="true" />
              Đã tiếp nhận
            </p>
            <dl className="pv-info-table">
              <div>
                <dt>Họ và tên</dt>
                <dd>{item.draft.name}</dd>
              </div>
              <div>
                <dt>Số điện thoại</dt>
                <dd>{item.draft.phone}</dd>
              </div>
              <div>
                <dt>Sản phẩm</dt>
                <dd>
                  {item.products.map((product) => (
                    <p key={product.id}>
                      <strong>{product.model}</strong> · {product.name}
                    </p>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Ghi chú</dt>
                <dd className="pv-note-value">
                  {item.draft.note || 'Không có ghi chú'}
                </dd>
              </div>
            </dl>
            <button
              className="pv-button pv-button-outline"
              onClick={() => void copy(item.receipt.requestId)}
            >
              Sao chép mã yêu cầu
            </button>
            <output>{copyState}</output>
            <ContactLinks />
          </div>
        </PreviewModal>
      )}
      {clear && (
        <PreviewModal
          title="Xóa thông tin khỏi màn hình?"
          description="Thao tác này không hủy yêu cầu đã gửi tới Hoa Nam."
          onClose={() => setClear(false)}
        >
          <div className="pv-library-actions">
            <button
              className="pv-button pv-button-outline"
              onClick={() => setClear(false)}
            >
              Giữ lại
            </button>
            <button
              className="pv-button"
              onClick={() => {
                onClear();
                setClear(false);
                setSelected(null);
              }}
            >
              Xóa khỏi màn hình
            </button>
          </div>
        </PreviewModal>
      )}
    </section>
  );
}
