'use client';
import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import {
  Package,
  CheckCircle2,
  Clock3,
  ArrowRight,
  Heart,
  GitCompareArrows,
} from 'lucide-react';
import { usePreviewLibrary } from '@/components/preview-library-state';
import type {
  ProductImage,
  Availability,
  PreviewProduct,
} from '@/lib/product-preview';
/** Show only the product area of the supplied screenshot; never generate product art. */
export function ProductPhoto({
  crop,
  label,
  hero = false,
}: {
  crop: ProductImage;
  label: string;
  hero?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cropStyle = {
    aspectRatio: `${crop.width} / ${crop.height}`,
  } as CSSProperties;
  return (
    <div
      aria-busy={!loaded && !failed}
      className={`pv-photo${hero ? ' pv-photo-hero' : ''}`}
    >
      {!loaded && !failed && (
        <span
          className="pv-photo-loading pv-skeleton"
          aria-label="Đang tải ảnh"
        />
      )}
      {failed ? (
        <div className="pv-image-fallback">
          <Package aria-hidden="true" />
          <span>Ảnh chưa hiển thị</span>
        </div>
      ) : (
        <div className="pv-photo-crop" style={cropStyle}>
          {/* The source screenshots are both 720 × 1600. CSS clips their UI chrome. */}
          <Image
            src={`${process.env.NEXT_PUBLIC_PREVIEW_ASSET_BASE ?? ''}/preview/product-${crop.source}-source.png`}
            alt={label}
            width={720}
            height={1600}
            unoptimized
            draggable={false}
            loading={hero ? 'eager' : 'lazy'}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            style={{
              width: `${(720 / crop.width) * 100}%`,
              maxWidth: 'none',
              left: `${(-crop.x / crop.width) * 100}%`,
              top: `${(-crop.y / crop.height) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export function AvailabilityBadge({ value }: { value: Availability }) {
  const ready = value === 'ready';
  const Icon = ready ? CheckCircle2 : Clock3;
  return (
    <span
      className={`pv-stock ${ready ? 'pv-stock-ready' : 'pv-stock-preorder'}`}
    >
      <Icon aria-hidden="true" />
      {ready ? 'Sẵn hàng' : 'Đặt trước'}
    </span>
  );
}

export function ProductCard({
  product,
  onOpen,
}: {
  product: PreviewProduct;
  onOpen: (id: string) => void;
}) {
  return (
    <article className="pv-product-card">
      <button
        className="pv-product-link"
        onClick={() => onOpen(product.id)}
        aria-label={`Xem ${product.name} ${product.model}, ${product.availability === 'ready' ? 'sẵn hàng' : 'đặt trước'}`}
      >
        <div className="pv-product-visual">
          <AvailabilityBadge value={product.availability} />
          <ProductPhoto
            crop={product.image}
            label={`${product.name} ${product.model}`}
          />
        </div>
        <div className="pv-product-copy">
          <span className="pv-model">{product.model}</span>
          <h3>{product.name}</h3>
          <span className="pv-product-action">
            Xem chi tiết <ArrowRight aria-hidden="true" />
          </span>
        </div>
      </button>
      <ProductTools product={product} />
    </article>
  );
}

export function ProductTools({ product }: { product: PreviewProduct }) {
  const library = usePreviewLibrary();
  const saved = library.saved.includes(product.id);
  const compared = library.compared.includes(product.id);
  return (
    <div className="pv-product-tools">
      <button
        type="button"
        disabled={!library.ready}
        aria-pressed={saved}
        aria-label={`${saved ? 'Bỏ lưu' : 'Lưu'} ${product.model}`}
        onClick={() => library.save(product.id)}
      >
        <Heart aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
        {saved ? 'Đã lưu' : 'Lưu'}
      </button>
      <button
        type="button"
        aria-pressed={compared}
        aria-label={`${compared ? 'Bỏ so sánh' : 'So sánh'} ${product.model}`}
        onClick={() => library.compare(product.id)}
      >
        <GitCompareArrows aria-hidden="true" />
        {compared ? 'Đã chọn' : 'So sánh'}
      </button>
    </div>
  );
}
