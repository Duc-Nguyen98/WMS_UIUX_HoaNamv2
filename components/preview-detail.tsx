'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  ZoomIn,
  ZoomOut,
  Package,
} from 'lucide-react';
import {
  PREVIEW_CATEGORIES,
  PREVIEW_GROUPS,
  PREVIEW_PRODUCTS,
  type PreviewProduct,
} from '@/lib/product-preview';
import { PREVIEW_CONTACT } from '@/lib/preview-request';
import {
  ProductPhoto,
  ProductCard,
  AvailabilityBadge,
  ProductTools,
} from '@/components/preview-products';
import { PreviewModal } from '@/components/preview-catalog';

function ImageViewer({
  product,
  onClose,
}: {
  product: PreviewProduct;
  onClose: () => void;
}) {
  const images = product.images?.length ? product.images : [product.image];
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const change = (step: number) => {
    setIndex((index + step + images.length) % images.length);
    setZoom(1);
  };
  return (
    <PreviewModal
      className="pv-image-viewer"
      title="Ảnh sản phẩm"
      description={`${product.model} · ${product.name}`}
      onClose={onClose}
    >
      <div className="pv-image-stage">
        <div style={{ width: `${zoom * 100}%` }}>
          <ProductPhoto
            key={index}
            crop={images[index]}
            label={`${product.name}, ảnh ${index + 1}`}
            hero
          />
        </div>
      </div>
      <div className="pv-image-tools">
        <button
          className="pv-icon-button"
          disabled={zoom === 1}
          onClick={() => setZoom(Math.max(1, zoom - 0.5))}
          aria-label="Thu nhỏ"
        >
          <ZoomOut />
        </button>
        <output aria-live="polite">{zoom * 100}%</output>
        <button
          className="pv-icon-button"
          disabled={zoom === 3}
          onClick={() => setZoom(Math.min(3, zoom + 0.5))}
          aria-label="Phóng to"
        >
          <ZoomIn />
        </button>
        <button className="pv-text-button" onClick={() => setZoom(1)}>
          Vừa màn hình
        </button>
      </div>
      {images.length > 1 && (
        <div className="pv-image-tools">
          <button
            className="pv-icon-button"
            onClick={() => change(-1)}
            aria-label="Ảnh trước"
          >
            <ChevronLeft />
          </button>
          <output aria-live="polite">
            {index + 1} / {images.length}
          </output>
          <button
            className="pv-icon-button"
            onClick={() => change(1)}
            aria-label="Ảnh tiếp theo"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </PreviewModal>
  );
}

export default function PreviewDetail({
  product,
  onBack,
  onRequest,
  onOpen,
  onContact,
}: {
  product?: PreviewProduct;
  onBack: () => void;
  onRequest: (id: string) => void;
  onOpen: (id: string) => void;
  onContact: () => void;
}) {
  const [viewer, setViewer] = useState(false);
  if (!product)
    return (
      <section className="pv-empty">
        <Package aria-hidden="true" />
        <h1>Sản phẩm hiện không khả dụng</h1>
        <p>Bạn có thể xem sản phẩm khác hoặc liên hệ để được hỗ trợ.</p>
        <button className="pv-button" onClick={onBack}>
          Quay lại danh mục
        </button>
        <button className="pv-text-button" onClick={onContact}>
          Liên hệ tư vấn
        </button>
      </section>
    );
  const related = PREVIEW_PRODUCTS.filter(
    (item) => item.id !== product.id && item.category === product.category,
  ).slice(0, 4);
  return (
    <section className="pv-product-detail">
      <button className="pv-back-to-groups" onClick={onBack}>
        <ArrowLeft aria-hidden="true" />
        Quay lại sản phẩm
      </button>
      <div className="pv-detail-layout">
        <div className="pv-detail-gallery">
          <button
            className="pv-detail-photo-button"
            onClick={() => setViewer(true)}
            aria-label="Xem ảnh sản phẩm lớn"
          >
            <ProductPhoto
              crop={product.image}
              label={`${product.name} ${product.model}`}
              hero
            />
            <span>
              <ZoomIn aria-hidden="true" />
              Xem ảnh lớn
            </span>
          </button>
        </div>
        <div className="pv-detail-summary">
          <div className="pv-detail-tags">
            <AvailabilityBadge value={product.availability} />
            <span className="pv-secondary">
              {PREVIEW_GROUPS.find((group) => group.id === product.group)?.name}
            </span>
          </div>
          <span className="pv-detail-model">{product.model}</span>
          <h1>{product.name}</h1>
          <ProductTools product={product} />
          <p className="pv-detail-category">
            {
              PREVIEW_CATEGORIES.find(
                (category) => category.id === product.category,
              )?.name
            }
          </p>
          {product.description && (
            <div className="pv-benefits">
              <h2>Công dụng và đặc điểm</h2>
              <ul>
                {product.description
                  .split('. ')
                  .filter(Boolean)
                  .map((text) => (
                    <li key={text}>{text.replace(/\.$/, '')}</li>
                  ))}
              </ul>
            </div>
          )}
          <div className="pv-detail-request-hint">
            <MessageCircle aria-hidden="true" />
            <p>
              Quan tâm đến sản phẩm này? Gửi yêu cầu để được tư vấn về sản phẩm
              và đặt hàng.
            </p>
          </div>
          <button
            className="pv-button pv-detail-desktop-request"
            onClick={() => onRequest(product.id)}
          >
            Gửi yêu cầu đặt hàng
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="pv-detail-information">
        <section>
          <h2>Thông tin sản phẩm</h2>
          <dl className="pv-info-table">
            <div>
              <dt>Mã sản phẩm</dt>
              <dd>{product.model}</dd>
            </div>
            <div>
              <dt>Nhóm sản phẩm</dt>
              <dd>
                {
                  PREVIEW_GROUPS.find((group) => group.id === product.group)
                    ?.title
                }
              </dd>
            </div>
            <div>
              <dt>Danh mục</dt>
              <dd>
                {
                  PREVIEW_CATEGORIES.find(
                    (category) => category.id === product.category,
                  )?.name
                }
              </dd>
            </div>
            <div>
              <dt>Tình trạng</dt>
              <dd>
                <AvailabilityBadge value={product.availability} />
              </dd>
            </div>
          </dl>
        </section>
        <section>
          <h2>Thông số kỹ thuật</h2>
          {product.specifications?.length ? (
            <dl className="pv-info-table">
              {product.specifications.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="pv-spec-help">
              <p>
                Liên hệ để được tư vấn thông số phù hợp với công việc của bạn.
              </p>
              <button className="pv-text-button" onClick={onContact}>
                Tư vấn thông số
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      </div>
      {related.length > 0 && (
        <section className="pv-section">
          <div className="pv-section-heading">
            <h2>Sản phẩm cùng danh mục</h2>
          </div>
          <div className="pv-product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} onOpen={onOpen} />
            ))}
          </div>
        </section>
      )}
      <div className="pv-detail-cta">
        <div>
          <strong>{product.model}</strong>
          <span>{product.name}</span>
        </div>
        <a
          className="pv-icon-button"
          href={`tel:${PREVIEW_CONTACT.phone}`}
          aria-label="Gọi hotline"
        >
          <Phone aria-hidden="true" />
        </a>
        {PREVIEW_CONTACT.zaloUrl ? (
          <a
            className="pv-icon-button"
            href={PREVIEW_CONTACT.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nhắn Zalo OA"
          >
            <MessageCircle aria-hidden="true" />
          </a>
        ) : (
          <button
            className="pv-icon-button"
            onClick={onContact}
            aria-label="Các kênh tư vấn"
          >
            <MessageCircle aria-hidden="true" />
          </button>
        )}
        <button className="pv-button" onClick={() => onRequest(product.id)}>
          Gửi yêu cầu đặt hàng
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
      {viewer && (
        <ImageViewer product={product} onClose={() => setViewer(false)} />
      )}
    </section>
  );
}
