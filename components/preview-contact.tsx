'use client';
import { useEffect, useRef, useState } from 'react';
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
import { copyPreviewText } from '@/lib/preview-clipboard';
import { PreviewModal } from '@/components/preview-catalog';

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
  const [manualCopy, setManualCopy] = useState(false);
  const copyButton = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copying = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  async function copyPhone() {
    if (copying.current) return;
    copying.current = true;
    const success = await copyPreviewText(PREVIEW_CONTACT.phone);
    copying.current = false;
    if (!mounted.current) return;
    if (timer.current) clearTimeout(timer.current);
    setCopied(success);
    if (success) timer.current = setTimeout(() => setCopied(false), 4000);
    else setManualCopy(true);
  }
  function closeManualCopy() {
    setManualCopy(false);
    requestAnimationFrame(() =>
      copyButton.current?.focus({ preventScroll: true }),
    );
  }
  return (
    <section className="pv-contact-screen" aria-labelledby="pv-contact-title">
      <div className="pv-contact-intro">
        <div className="pv-contact-kicker">
          <MessageCircle aria-hidden="true" />
          <span>KẾT NỐI VỚI HOA NAM</span>
        </div>
        <h1 id="pv-contact-title">Liên hệ & tư vấn</h1>
        <p>Chọn cách kết nối phù hợp với bạn.</p>
      </div>
      <div className="pv-contact-methods">
        <article
          className="pv-contact-card pv-contact-primary"
          aria-labelledby="pv-contact-request-title"
        >
          <div className="pv-contact-card-heading">
            <span className="pv-contact-icon">
              <Send aria-hidden="true" />
            </span>
            <h2 id="pv-contact-request-title">Gửi yêu cầu đặt hàng</h2>
          </div>
          <p>Để lại sản phẩm và thông tin liên hệ để Hoa Nam tư vấn.</p>
          <button type="button" className="pv-button" onClick={onRequest}>
            Gửi yêu cầu
            <ArrowRight aria-hidden="true" />
          </button>
        </article>
        <article
          className="pv-contact-card"
          aria-labelledby="pv-contact-phone-title"
        >
          <div className="pv-contact-card-heading">
            <Phone className="pv-contact-heading-icon" aria-hidden="true" />
            <h2 id="pv-contact-phone-title">Gọi hotline</h2>
          </div>
          <div className="pv-contact-phone-row">
            <a
              className="pv-phone-number"
              href={`tel:${PREVIEW_CONTACT.phone}`}
              aria-label={`Gọi hotline ${PREVIEW_CONTACT.phoneDisplay}`}
            >
              {PREVIEW_CONTACT.phoneDisplay}
            </a>
            <button
              ref={copyButton}
              type="button"
              className="pv-icon-button pv-copy-phone"
              aria-label="Sao chép số điện thoại"
              onClick={() => void copyPhone()}
            >
              {copied ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
            </button>
          </div>
          <p>Trao đổi trực tiếp với nhân viên tư vấn.</p>
          <a
            className="pv-button pv-button-outline"
            href={`tel:${PREVIEW_CONTACT.phone}`}
          >
            <Phone aria-hidden="true" />
            Gọi ngay
          </a>
        </article>
        <article
          className="pv-contact-card pv-contact-zalo"
          aria-labelledby="pv-contact-zalo-title"
        >
          <div className="pv-contact-card-heading">
            <span className="pv-contact-icon pv-contact-icon-neutral">
              <MessageCircle aria-hidden="true" />
            </span>
            <h2 id="pv-contact-zalo-title">Nhắn Zalo OA</h2>
          </div>
          {PREVIEW_CONTACT.zaloUrl ? (
            <>
              <p>Trao đổi với Hoa Nam về sản phẩm bạn quan tâm.</p>
              <a
                className="pv-button pv-contact-tonal"
                href={PREVIEW_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mở Zalo OA
                <ArrowRight aria-hidden="true" />
              </a>
            </>
          ) : (
            <>
              <span className="pv-contact-badge">Tạm thời chưa khả dụng</span>
              <p>Bạn vẫn có thể gửi yêu cầu hoặc gọi hotline.</p>
            </>
          )}
        </article>
      </div>
      <section
        className="pv-contact-card pv-support-hours"
        aria-labelledby="pv-hours-title"
      >
        <div className="pv-contact-card-heading">
          <Clock3 aria-hidden="true" />
          <h2 id="pv-hours-title">Giờ hỗ trợ</h2>
        </div>
        <dl>
          <div>
            <dt>Thứ Hai – Thứ Sáu</dt>
            <dd>08:00 – 17:30</dd>
          </div>
          <div>
            <dt>Thứ Bảy</dt>
            <dd>08:00 – 12:00</dd>
          </div>
        </dl>
      </section>
      <button
        type="button"
        className="pv-text-button pv-contact-back"
        onClick={onBrowse}
      >
        Tiếp tục xem sản phẩm
        <ArrowRight aria-hidden="true" />
      </button>
      <output
        aria-live="polite"
        aria-atomic="true"
        className="pv-contact-feedback"
      >
        {copied && (
          <span className="pv-contact-toast">
            <Check aria-hidden="true" />
            <span>Đã sao chép số điện thoại</span>
          </span>
        )}
      </output>
      {manualCopy && (
        <PreviewModal
          title="Sao chép số điện thoại"
          description="Chưa sao chép tự động được. Nhấn giữ số bên dưới và chọn Sao chép."
          onClose={closeManualCopy}
          className="pv-contact-copy-dialog"
        >
          <div className="pv-contact-copy-content">
            <label htmlFor="pv-copy-number">Số điện thoại hotline</label>
            <input
              id="pv-copy-number"
              type="text"
              readOnly
              value={PREVIEW_CONTACT.phone}
              onFocus={(event) => event.currentTarget.select()}
            />
            <button
              type="button"
              className="pv-button pv-button-outline"
              onClick={closeManualCopy}
            >
              Đóng
            </button>
          </div>
        </PreviewModal>
      )}
    </section>
  );
}
