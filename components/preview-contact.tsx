'use client';
import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Clock3,
  Copy,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { PREVIEW_CONTACT } from '@/lib/preview-request';

export function ContactLinks() {
  return (
    <div className="pv-contact-shortcuts">
      <a href={`tel:${PREVIEW_CONTACT.phone}`}>
        <Phone aria-hidden="true" />
        Gọi hotline
      </a>
      {PREVIEW_CONTACT.zaloUrl && (
        <a
          href={PREVIEW_CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle aria-hidden="true" />
          Nhắn Zalo OA
        </a>
      )}
    </div>
  );
}

export default function PreviewContact({
  onRequest,
  onBrowse,
}: {
  onRequest: () => void;
  onBrowse: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(PREVIEW_CONTACT.phone);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <section className="pv-contact pv-contact-screen">
      <div className="pv-contact-intro">
        <span className="pv-contact-icon">
          <MessageCircle aria-hidden="true" />
        </span>
        <span className="pv-eyebrow">KẾT NỐI VỚI HOA NAM</span>
        <h1>Cùng bạn chọn đúng sản phẩm.</h1>
        <p>Gửi nhu cầu hoặc liên hệ trực tiếp để được tư vấn.</p>
      </div>
      <div className="pv-contact-grid">
        <article className="pv-contact-card pv-contact-primary">
          <span className="pv-group-icon">
            <Send aria-hidden="true" />
          </span>
          <h2>Gửi yêu cầu đặt hàng</h2>
          <p>
            Để lại sản phẩm quan tâm và thông tin liên hệ để nhân viên tư vấn hỗ
            trợ bạn.
          </p>
          <button className="pv-button" onClick={onRequest}>
            Gửi yêu cầu
            <ArrowRight aria-hidden="true" />
          </button>
        </article>
        <article className="pv-contact-card">
          <span className="pv-group-icon">
            <Phone aria-hidden="true" />
          </span>
          <h2>Gọi hotline</h2>
          <a className="pv-phone-number" href={`tel:${PREVIEW_CONTACT.phone}`}>
            {PREVIEW_CONTACT.phoneDisplay}
          </a>
          <p>Trao đổi trực tiếp với nhân viên tư vấn.</p>
          <a
            className="pv-button pv-button-outline"
            href={`tel:${PREVIEW_CONTACT.phone}`}
          >
            Gọi điện
            <ArrowRight aria-hidden="true" />
          </a>
          <button className="pv-text-button" onClick={copyPhone}>
            {copied ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
            {copied ? 'Đã sao chép số' : 'Sao chép số điện thoại'}
          </button>
          {copyError && (
            <output>
              Bạn có thể chọn số điện thoại phía trên để sao chép.
            </output>
          )}
        </article>
        <article className="pv-contact-card">
          <span className="pv-group-icon">
            <MessageCircle aria-hidden="true" />
          </span>
          <h2>Nhắn Zalo OA</h2>
          <p>
            {PREVIEW_CONTACT.zaloUrl
              ? 'Nhắn tin cho Hoa Nam để trao đổi về sản phẩm bạn quan tâm.'
              : 'Kênh Zalo hiện chưa khả dụng. Bạn có thể gửi yêu cầu hoặc gọi hotline.'}
          </p>
          {PREVIEW_CONTACT.zaloUrl ? (
            <a
              className="pv-button pv-button-outline"
              href={PREVIEW_CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Mở Zalo OA
              <ArrowRight aria-hidden="true" />
            </a>
          ) : (
            <button className="pv-button pv-button-outline" disabled>
              Chưa khả dụng
            </button>
          )}
        </article>
      </div>
      <div className="pv-support-hours">
        <Clock3 aria-hidden="true" />
        <h2>Giờ hỗ trợ</h2>
        <div>
          <span>Thứ Hai – Thứ Sáu</span>
          <strong>08:00 – 17:30</strong>
        </div>
        <div>
          <span>Thứ Bảy</span>
          <strong>08:00 – 12:00</strong>
        </div>
      </div>
      <button className="pv-text-button" onClick={onBrowse}>
        Tiếp tục xem sản phẩm
        <ArrowRight aria-hidden="true" />
      </button>
    </section>
  );
}
