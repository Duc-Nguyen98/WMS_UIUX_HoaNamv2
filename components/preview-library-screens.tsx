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
        <ProgressiveProducts products={products} scope={`library:${kind}`} onOpen={onOpen} />
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
  const [category, setCategory] = useState(
    PREVIEW_CATEGORIES.find(
      (item) =>
        PREVIEW_PRODUCTS.filter((product) => product.category === item.id)
          .length >= 2,
    )?.id ?? PREVIEW_PRODUCTS[0].category,
  );
  const activeCategory = products[0]?.category ?? category;
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
  return (
    <section className="pv-library-screen">
      <ScreenHeading
        title="So sánh sản phẩm"
        description="Đặt 2–3 model cùng danh mục cạnh nhau để chọn sản phẩm phù hợp."
        navigate={navigate}
      />
      <div className="pv-library-toolbar">
        <span>{products.length}/3 sản phẩm đã chọn</span>
        {products.length > 0 && (
          <button className="pv-text-button" onClick={library.clearComparison}>
            <Trash2 aria-hidden="true" />
            Xóa lựa chọn
          </button>
        )}
      </div>
      {!products.length && (
        <label className="pv-compare-category">
          Danh mục so sánh
          <select
            value={activeCategory}
            onChange={(event) =>
              setCategory(event.target.value as typeof category)
            }
          >
            {PREVIEW_CATEGORIES.filter((item) =>
              PREVIEW_PRODUCTS.some((product) => product.category === item.id),
            ).map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {products.length < 3 && (
        <div className="pv-compare-picker">
          <h2>
            {products.length
              ? 'Thêm sản phẩm cùng danh mục'
              : 'Chọn sản phẩm bắt đầu'}
          </h2>
          <div className="pv-compare-options">
            {candidates.map((product) => (
              <button
                key={product.id}
                onClick={() => library.compare(product.id)}
              >
                <ProductPhoto crop={product.image} label={product.name} />
                <span>
                  <strong>{product.model}</strong>
                  {product.name}
                </span>
                <ListPlus aria-hidden="true" />
              </button>
            ))}
          </div>
          {!candidates.length && (
            <p>
              Chưa có sản phẩm khác trong danh mục này. Bạn có thể xóa lựa chọn
              để đổi danh mục.
            </p>
          )}
        </div>
      )}
      {products.length === 1 && (
        <p className="pv-device-note">
          Chọn thêm một sản phẩm để bắt đầu so sánh.
        </p>
      )}
      {products.length >= 2 && (
        <>
          <p className="pv-table-hint">
            Trên điện thoại, vuốt ngang bảng để xem các model.
          </p>
          {/* Keyboard users need a focusable scroll container to reach off-screen comparison columns. */}
          {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
          <section
            className="pv-comparison-scroll"
            aria-label="Bảng so sánh sản phẩm, có thể cuộn ngang"
            tabIndex={0}
          >
            <table className="pv-comparison-table">
              <caption className="sr-only">
                So sánh {products.map((item) => item.model).join(', ')}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Sản phẩm</th>
                  {products.map((product) => (
                    <th scope="col" key={product.id}>
                      <button
                        className="pv-compare-open"
                        onClick={() => onOpen(product.id)}
                      >
                        <ProductPhoto
                          crop={product.image}
                          label={product.name}
                        />
                        <strong>{product.model}</strong>
                        <span>{product.name}</span>
                      </button>
                      <button
                        className="pv-text-button"
                        onClick={() => library.compare(product.id)}
                        aria-label={`Bỏ ${product.model} khỏi bảng so sánh`}
                      >
                        <X aria-hidden="true" />
                        Bỏ chọn
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Tình trạng</th>
                  {products.map((product) => (
                    <td key={product.id}>
                      <AvailabilityBadge value={product.availability} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Danh mục</th>
                  {products.map((product) => (
                    <td key={product.id}>
                      {
                        PREVIEW_CATEGORIES.find(
                          (item) => item.id === product.category,
                        )?.name
                      }
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Công dụng & đặc điểm</th>
                  {products.map((product) => (
                    <td key={product.id}>
                      {product.description ||
                        'Liên hệ để được tư vấn công dụng phù hợp.'}
                    </td>
                  ))}
                </tr>
                {specLabels.length ? (
                  specLabels.map((label) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {products.map((product) => (
                        <td key={product.id}>
                          {product.specifications?.find(
                            (spec) => spec.label === label,
                          )?.value ?? 'Chưa có thông tin'}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <th scope="row">Thông số kỹ thuật</th>
                    {products.map((product) => (
                      <td key={product.id}>Liên hệ để được tư vấn thông số.</td>
                    ))}
                  </tr>
                )}
                <tr>
                  <th scope="row">Tư vấn sản phẩm</th>
                  {products.map((product) => (
                    <td key={product.id}>
                      <button
                        className="pv-button pv-button-outline"
                        onClick={() => onRequest([product.id])}
                      >
                        Gửi yêu cầu
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>
          {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
          <div className="pv-library-actions">
            <button
              className="pv-button"
              onClick={() => onRequest(products.map((item) => item.id))}
            >
              Nhờ tư vấn các sản phẩm này <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </>
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
