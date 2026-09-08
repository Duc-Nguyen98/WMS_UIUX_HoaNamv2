'use client';
import type { RefObject } from 'react';
import {
  Drill,
  Wrench,
  Zap,
  Hammer,
  SlidersHorizontal,
  Ruler,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@base-ui/react/button';
import { ProductPhoto } from '@/components/preview-products';
import {
  PREVIEW_PRODUCTS,
  PREVIEW_GROUPS,
  PREVIEW_HOME_CATEGORIES,
  DEFAULT_PREVIEW_FILTERS,
  previewGroupFilters,
  type PreviewFilters,
  type PreviewView,
  type ProductGroup,
} from '@/lib/product-preview';
const groupIcons = { machine: Drill, hand: Wrench, accessory: Zap };
const categoryIcons = {
  clamping: Hammer,
  construction: SlidersHorizontal,
  cutting: Ruler,
  drilling: Drill,
};
export default function PreviewHome({
  navigate,
  headingRef,
  activeGroup,
}: {
  navigate: (view: PreviewView, filters: PreviewFilters) => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  activeGroup: ProductGroup;
}) {
  return (
    <>
      <section className="pv-hero" aria-labelledby="pv-home-title">
        <div className="pv-hero-copy">
          <span className="pv-eyebrow">DỤNG CỤ CHO MỌI CÔNG VIỆC</span>
          <h1 id="pv-home-title" ref={headingRef} tabIndex={-1}>
            Tìm đúng dụng cụ.
            <br />
            <span>Làm tốt công việc.</span>
          </h1>
          <p>
            Khám phá sản phẩm phù hợp và xem tình trạng hàng trước khi liên hệ
            tư vấn.
          </p>
          <Button
            className="pv-button"
            onClick={() => navigate('catalog', DEFAULT_PREVIEW_FILTERS)}
          >
            Khám phá sản phẩm <ArrowRight aria-hidden="true" />
          </Button>
        </div>
        <div className="pv-hero-product">
          <ProductPhoto
            crop={PREVIEW_PRODUCTS[0].image}
            label="Khoan búa dùng pin DCZC02-26"
            hero
          />
          <span className="pv-hero-caption">
            Khoan búa dùng pin <strong>DCZC02-26</strong>
          </span>
        </div>
      </section>
      <section className="pv-section" aria-labelledby="pv-groups-heading">
        <div className="pv-section-heading">
          <h2 id="pv-groups-heading">Bạn đang tìm dụng cụ nào?</h2>
          <span className="pv-secondary">Nhóm sản phẩm</span>
        </div>
        <div className="pv-groups">
          {PREVIEW_GROUPS.map((group) => {
            const Icon = groupIcons[group.id];
            return (
              <button
                key={group.id}
                className="pv-group"
                onClick={() =>
                  navigate('groups', previewGroupFilters(group.id))
                }
              >
                <span className={`pv-group-icon pv-group-${group.id}`}>
                  <Icon aria-hidden="true" />
                </span>
                <span className="pv-group-copy">
                  <strong>{group.name}</strong>
                  <span>{group.description}</span>
                </span>
                <ChevronRight className="pv-group-arrow" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>
      <section
        className="pv-section pv-category-section"
        aria-labelledby="pv-category-heading"
      >
        <div className="pv-section-heading">
          <h2 id="pv-category-heading">Danh mục chính</h2>
          <button
            className="pv-text-button"
            onClick={() => navigate('groups', previewGroupFilters(activeGroup))}
          >
            Xem tất cả <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <div className="pv-categories">
          {PREVIEW_HOME_CATEGORIES.map((category) => {
            const Icon =
              categoryIcons[category.id as keyof typeof categoryIcons];
            return (
              <button
                key={category.id}
                onClick={() =>
                  navigate(
                    'catalog',
                    previewGroupFilters(category.group, category.id),
                  )
                }
              >
                <Icon aria-hidden="true" />
                <span>{category.name}</span>
                <ChevronRight
                  className="pv-category-arrow"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
