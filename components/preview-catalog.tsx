'use client';

import { useState, type ReactNode } from 'react';
import { Dialog as Primitive } from '@base-ui/react/dialog';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  SearchX,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  ProductCard,
  ProductPhoto,
  AvailabilityBadge,
} from '@/components/preview-products';
import {
  DEFAULT_PREVIEW_FILTERS,
  PREVIEW_CATEGORIES,
  PREVIEW_GROUPS,
  PREVIEW_PRODUCTS,
  filterPreviewProducts,
  previewCategoriesForGroup,
  type PreviewFilters,
} from '@/lib/product-preview';

export function PreviewModal({
  title,
  description,
  children,
  onClose,
  className = '',
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  return (
    <Primitive.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Primitive.Portal>
        <Primitive.Backdrop className="pv-modal-backdrop" />
        <Primitive.Popup className={`pv-theme pv-modal ${className}`}>
          <div className="pv-modal-heading">
            <Primitive.Title>{title}</Primitive.Title>
            <Primitive.Close className="pv-icon-button" aria-label="Đóng">
              <X aria-hidden="true" />
            </Primitive.Close>
          </div>
          <Primitive.Description className="pv-modal-description">
            {description}
          </Primitive.Description>
          {children}
        </Primitive.Popup>
      </Primitive.Portal>
    </Primitive.Root>
  );
}

export function PreviewSkeleton({ detail = false }: { detail?: boolean }) {
  return (
    <div
      className={`pv-loading-screen ${detail ? 'pv-loading-detail' : ''}`}
      aria-busy="true"
      aria-label="Đang tải nội dung"
    >
      <output className="sr-only">Đang tải nội dung</output>
      <div className="pv-skeleton pv-loading-title" />
      <div className="pv-loading-grid">
        {Array.from({ length: detail ? 1 : 4 }, (_, index) => (
          <div key={index} className="pv-loading-card">
            <div className="pv-skeleton pv-loading-image" />
            <div className="pv-skeleton pv-loading-line" />
            <div className="pv-skeleton pv-loading-line short" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusFilters({
  value,
  onChange,
}: {
  value: PreviewFilters['availability'];
  onChange: (value: PreviewFilters['availability']) => void;
}) {
  return (
    <fieldset className="pv-status-filters">
      <legend className="sr-only">Trạng thái hàng</legend>
      <button
        type="button"
        aria-pressed={value === 'all'}
        onClick={() => onChange('all')}
      >
        Tất cả
      </button>
      <button
        type="button"
        aria-pressed={value === 'ready'}
        onClick={() => onChange('ready')}
      >
        <CheckCircle2 aria-hidden="true" />
        Sẵn hàng
      </button>
      <button
        type="button"
        aria-pressed={value === 'preorder'}
        onClick={() => onChange('preorder')}
      >
        <Clock3 aria-hidden="true" />
        Đặt trước
      </button>
    </fieldset>
  );
}

function FilterSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: PreviewFilters;
  onApply: (filters: PreviewFilters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(filters);
  const count = filterPreviewProducts(PREVIEW_PRODUCTS, draft).length;
  return (
    <PreviewModal
      className="pv-filter-sheet"
      title="Lọc và sắp xếp"
      description="Chọn sản phẩm phù hợp với nhu cầu của bạn."
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onApply(draft);
        }}
      >
        <div className="pv-filter-fields">
          <div>
            <span className="pv-field-title">Trạng thái hàng</span>
            <StatusFilters
              value={draft.availability}
              onChange={(availability) => setDraft({ ...draft, availability })}
            />
          </div>
          <label>
            Nhóm sản phẩm
            <select
              value={draft.group}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  group: event.target.value as PreviewFilters['group'],
                  category: 'all',
                })
              }
            >
              <option value="all">Tất cả nhóm</option>
              {PREVIEW_GROUPS.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Danh mục
            <select
              value={draft.category}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  category: event.target.value as PreviewFilters['category'],
                })
              }
            >
              <option value="all">Tất cả danh mục</option>
              {previewCategoriesForGroup(draft.group).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sắp xếp
            <select
              value={draft.sort}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  sort: event.target.value as PreviewFilters['sort'],
                })
              }
            >
              <option value="default">
                {filters.query ? 'Phù hợp nhất' : 'Mặc định'}
              </option>
              <option value="name">Tên sản phẩm A–Z</option>
            </select>
          </label>
        </div>
        <div className="pv-modal-actions">
          <button
            type="button"
            className="pv-button pv-button-outline"
            onClick={() =>
              setDraft({ ...DEFAULT_PREVIEW_FILTERS, query: filters.query })
            }
          >
            Xóa bộ lọc
          </button>
          <button className="pv-button" type="submit">
            Áp dụng · {count} sản phẩm
          </button>
        </div>
      </form>
    </PreviewModal>
  );
}

export default function PreviewCatalog({
  filters,
  onChange,
  onOpen,
  onBack,
  mode = 'catalog',
}: {
  filters: PreviewFilters;
  onChange: (filters: PreviewFilters) => void;
  onOpen: (id: string) => void;
  onBack: () => void;
  mode?: 'catalog' | 'search' | 'home';
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const products = filterPreviewProducts(PREVIEW_PRODUCTS, filters);
  const visible = mode === 'home' ? products.slice(0, 4) : products;
  const count =
    Number(filters.availability !== 'all') +
    Number(filters.group !== 'all') +
    Number(filters.category !== 'all') +
    Number(filters.sort !== 'default');
  const title =
    filters.category !== 'all'
      ? PREVIEW_CATEGORIES.find((c) => c.id === filters.category)?.name
      : filters.group !== 'all'
        ? PREVIEW_GROUPS.find((g) => g.id === filters.group)?.title
        : 'Tất cả sản phẩm';
  const suggestions = mode === 'search' && !filters.query;
  return (
    <section className="pv-section pv-catalog-screen">
      {mode === 'catalog' && (
        <button className="pv-back-to-groups" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          Danh mục theo nhóm
        </button>
      )}
      <div className="pv-catalog-title">
        <div>
          {mode === 'home' ? (
            <h2>Sản phẩm trong danh mục</h2>
          ) : (
            <>
              <span className="pv-eyebrow">
                {mode === 'search' ? 'TÌM SẢN PHẨM' : 'KHÁM PHÁ DANH MỤC'}
              </span>
              <h1>{mode === 'search' ? 'Tìm kiếm sản phẩm' : title}</h1>
              <p>
                {suggestions
                  ? 'Chọn một sản phẩm hoặc tìm theo tên, model, công dụng.'
                  : filters.query
                    ? `Kết quả cho “${filters.query}”`
                    : 'Chọn sản phẩm để xem thông tin và gửi yêu cầu tư vấn.'}
              </p>
            </>
          )}
        </div>
        {mode !== 'home' && !suggestions && (
          <button
            className="pv-button pv-button-outline"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal aria-hidden="true" />
            Lọc và sắp xếp{count > 0 ? ` (${count})` : ''}
          </button>
        )}
      </div>
      {!suggestions && (
        <div className="pv-filter-bar">
          <StatusFilters
            value={filters.availability}
            onChange={(availability) => onChange({ ...filters, availability })}
          />
          <output aria-live="polite" className="pv-result-count">
            {products.length} sản phẩm
          </output>
        </div>
      )}
      {count > 0 && mode !== 'home' && (
        <div className="pv-applied-filters">
          {filters.group !== 'all' && (
            <button
              onClick={() =>
                onChange({ ...filters, group: 'all', category: 'all' })
              }
            >
              {PREVIEW_GROUPS.find((g) => g.id === filters.group)?.name}
              <X aria-hidden="true" />
              <span className="sr-only">Bỏ lọc nhóm</span>
            </button>
          )}
          {filters.category !== 'all' && (
            <button onClick={() => onChange({ ...filters, category: 'all' })}>
              {PREVIEW_CATEGORIES.find((c) => c.id === filters.category)?.name}
              <X aria-hidden="true" />
              <span className="sr-only">Bỏ lọc danh mục</span>
            </button>
          )}
          <button
            className="pv-clear-filter"
            onClick={() =>
              onChange({ ...DEFAULT_PREVIEW_FILTERS, query: filters.query })
            }
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
      {suggestions ? (
        <>
          <div className="pv-section-heading">
            <h2>Khám phá sản phẩm</h2>
            <span className="pv-result-count">{products.length} sản phẩm</span>
          </div>
          <div className="pv-suggestion-list">
            {products.map((product) => (
              <button key={product.id} onClick={() => onOpen(product.id)}>
                <ProductPhoto crop={product.image} label={product.name} />
                <span className="pv-suggestion-copy">
                  <strong>{product.name}</strong>
                  <span>{product.model}</span>
                </span>
                <AvailabilityBadge value={product.availability} />
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </div>
        </>
      ) : visible.length ? (
        <div className="pv-product-grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <div className="pv-empty">
          <span className="pv-empty-icon">
            <SearchX aria-hidden="true" />
          </span>
          <h2>Chưa tìm thấy sản phẩm phù hợp</h2>
          <p>Thử từ khóa khác hoặc xóa bộ lọc để xem thêm sản phẩm.</p>
          <button
            className="pv-button"
            onClick={() => onChange({ ...DEFAULT_PREVIEW_FILTERS })}
          >
            Xem tất cả sản phẩm
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      )}
      {filterOpen && (
        <FilterSheet
          filters={filters}
          onClose={() => setFilterOpen(false)}
          onApply={(next) => {
            onChange(next);
            setFilterOpen(false);
          }}
        />
      )}
    </section>
  );
}
