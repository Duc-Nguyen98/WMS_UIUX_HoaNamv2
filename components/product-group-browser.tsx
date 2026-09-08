'use client';

import type { Ref } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Cog,
  Drill,
  Hammer,
  LayoutGrid,
  PackageOpen,
  PlugZap,
  Ruler,
  SlidersHorizontal,
  TreePine,
  Waves,
  Wrench,
  Zap,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/preview-primitives';
import {
  PREVIEW_GROUPS,
  previewCategoriesForGroup,
  previewGroupFilters,
  previewHash,
  type ProductCategory,
  type ProductGroup,
} from '@/lib/product-preview';
import './product-group-browser.css';

const groupIcons = { machine: Drill, hand: Wrench, accessory: Zap };
const categoryIcons = {
  construction: Hammer,
  drilling: Drill,
  'garden-power': TreePine,
  grinding: SlidersHorizontal,
  planing: Ruler,
  'other-power': Cog,
  clamping: Hammer,
  cutting: Ruler,
  electrical: PlugZap,
  fastening: Wrench,
  'garden-hand': TreePine,
  hydraulic: Waves,
};

export default function ProductGroupBrowser({
  group,
  onGroupChange,
  onOpenCategory,
  onContact,
  headingRef,
}: {
  group: ProductGroup;
  onGroupChange: (group: ProductGroup) => void;
  onOpenCategory: (
    group: ProductGroup,
    category: ProductCategory | 'all',
  ) => void;
  onContact: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  return (
    <section
      className="pv-group-browser"
      aria-labelledby="pv-group-browser-title"
    >
      <div className="pv-group-browser-heading">
        <h1 id="pv-group-browser-title" tabIndex={-1} ref={headingRef}>
          Danh mục sản phẩm
        </h1>
        <p>Chọn nhóm dụng cụ bạn đang tìm.</p>
      </div>
      <Tabs
        className="pv-group-tabs"
        value={group}
        onValueChange={(value) => {
          if (PREVIEW_GROUPS.some((item) => item.id === value))
            onGroupChange(value as ProductGroup);
        }}
      >
        <TabsList
          className="pv-group-tablist"
          aria-label="Nhóm sản phẩm"
          activateOnFocus
        >
          {PREVIEW_GROUPS.map((item) => {
            const Icon = groupIcons[item.id];
            return (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="pv-group-tab"
              >
                <span className="pv-tab-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="pv-tab-label">{item.name}</span>
                <Check className="pv-tab-check" aria-hidden="true" />
              </TabsTrigger>
            );
          })}
        </TabsList>
        {PREVIEW_GROUPS.map((item) => {
          const categories = previewCategoriesForGroup(item.id);
          const Icon = groupIcons[item.id];
          return (
            <TabsContent
              key={item.id}
              value={item.id}
              className="pv-group-panel"
            >
              <div className="pv-group-overview">
                <div className="pv-group-overview-title">
                  <span className="pv-group-overview-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                </div>
                <a
                  className="pv-group-all"
                  href={previewHash('catalog', previewGroupFilters(item.id))}
                  onClick={(event) => {
                    if (
                      event.ctrlKey ||
                      event.metaKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    onOpenCategory(item.id, 'all');
                  }}
                >
                  <LayoutGrid aria-hidden="true" />
                  <span>Tất cả sản phẩm</span>
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
              <div className="pv-group-directory">
                {categories.length > 0 ? (
                  <>
                    <div className="pv-group-directory-heading">
                      <h3>Khám phá theo danh mục</h3>
                      <span>{categories.length} danh mục</span>
                    </div>
                    <ul className="pv-group-category-list">
                      {categories.map((category) => {
                        const CategoryIcon = categoryIcons[category.id];
                        return (
                          <li key={category.id}>
                            <a
                              href={previewHash(
                                'catalog',
                                previewGroupFilters(item.id, category.id),
                              )}
                              onClick={(event) => {
                                if (
                                  event.ctrlKey ||
                                  event.metaKey ||
                                  event.shiftKey ||
                                  event.altKey
                                )
                                  return;
                                event.preventDefault();
                                onOpenCategory(item.id, category.id);
                              }}
                            >
                              <span className="pv-directory-icon">
                                <CategoryIcon aria-hidden="true" />
                              </span>
                              <span className="pv-directory-name">
                                {category.name}
                              </span>
                              <ChevronRight aria-hidden="true" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <div className="pv-group-unavailable">
                    <span className="pv-group-unavailable-icon">
                      <PackageOpen aria-hidden="true" />
                    </span>
                    <h3>Chưa có danh mục để hiển thị</h3>
                    <p>
                      Liên hệ để được tư vấn phụ kiện phù hợp với dụng cụ của
                      bạn.
                    </p>
                    <a
                      href="#view=contact"
                      onClick={(event) => {
                        if (
                          event.ctrlKey ||
                          event.metaKey ||
                          event.shiftKey ||
                          event.altKey
                        )
                          return;
                        event.preventDefault();
                        onContact();
                      }}
                      className="pv-text-button"
                    >
                      Tư vấn phụ kiện <ArrowRight aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
      <div className="pv-group-help">
        <CircleHelp aria-hidden="true" />
        <p>Cần giúp chọn dụng cụ?</p>
        <a
          href="#view=contact"
          onClick={(event) => {
            if (
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            event.preventDefault();
            onContact();
          }}
        >
          Liên hệ tư vấn <ChevronRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
