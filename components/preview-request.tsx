'use client';
import { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  LoaderCircle,
  Send,
} from 'lucide-react';
import { PREVIEW_PRODUCTS } from '@/lib/product-preview';
import {
  PREVIEW_CONTACT,
  sendPreviewRequest,
  validatePreviewRequest,
  type RequestDraft,
  type RequestErrors,
  type RequestReceipt,
  type RequestState,
  EMPTY_REQUEST,
  type SentRequest,
} from '@/lib/preview-request';
import { ProductPhoto, AvailabilityBadge } from '@/components/preview-products';
import { ContactLinks } from '@/components/preview-contact';
import { PreviewModal } from '@/components/preview-catalog';

export function RequestConfirmation({
  receipt,
  sent,
  onBrowse,
  onHistory,
}: {
  receipt: RequestReceipt;
  sent: RequestDraft;
  onBrowse: () => void;
  onHistory: () => void;
}) {
  const products = PREVIEW_PRODUCTS.filter((item) =>
    sent.productIds.includes(item.id),
  );
  const [copyState, setCopyState] = useState('');
  async function copyReference() {
    try {
      await navigator.clipboard.writeText(receipt.requestId);
      setCopyState('Đã sao chép mã yêu cầu.');
    } catch {
      setCopyState('Chưa sao chép được. Bạn có thể chọn mã để sao chép.');
    }
  }
  return (
    <section className="pv-request-success">
      <span className="pv-success-icon">
        <CheckCircle2 aria-hidden="true" />
      </span>
      <span className="pv-eyebrow">YÊU CẦU ĐÃ ĐƯỢC TIẾP NHẬN</span>
      <h1>Đã gửi yêu cầu đặt hàng</h1>
      <p>
        Cảm ơn bạn. Nhân viên tư vấn sẽ liên hệ theo thông tin bạn đã cung cấp.
      </p>
      <div className="pv-receipt">
        <h2>Thông tin yêu cầu</h2>
        <dl className="pv-info-table">
          <div>
            <dt>Mã yêu cầu</dt>
            <dd>{receipt.requestId}</dd>
          </div>
          <div>
            <dt>Họ và tên</dt>
            <dd>{sent.name}</dd>
          </div>
          <div>
            <dt>Số điện thoại</dt>
            <dd>{sent.phone}</dd>
          </div>
          <div>
            <dt>Sản phẩm</dt>
            <dd>
              {products.map((product) => (
                <p key={product.id}>
                  <strong>{product.model}</strong> · {product.name}
                </p>
              ))}
            </dd>
          </div>
          {sent.note && (
            <div>
              <dt>Ghi chú</dt>
              <dd className="pv-note-value">{sent.note}</dd>
            </div>
          )}
        </dl>
      </div>
      <button className="pv-button" onClick={onBrowse}>
        Tiếp tục xem sản phẩm
        <ArrowRight aria-hidden="true" />
      </button>
      <div className="pv-library-actions">
        <button
          className="pv-button pv-button-outline"
          onClick={() => void copyReference()}
        >
          Sao chép mã yêu cầu
        </button>
        <button className="pv-text-button" onClick={onHistory}>
          Xem yêu cầu đã gửi
        </button>
      </div>
      <output>{copyState}</output>
      <ContactLinks />
    </section>
  );
}

export default function PreviewRequest({
  state,
  onChange,
  onBack,
  onBrowse,
  onEditProducts,
  onAccepted,
  onHistory,
}: {
  state: RequestState;
  onChange: (state: RequestState) => void;
  onBack: () => void;
  onBrowse: () => void;
  onEditProducts: () => void;
  onAccepted: (record: SentRequest) => void;
  onHistory: () => void;
}) {
  const [errors, setErrors] = useState<RequestErrors>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { draft } = state;
  const products = draft.productIds.flatMap((id) => {
    const item = PREVIEW_PRODUCTS.find((product) => product.id === id);
    return item ? [item] : [];
  });
  function update(field: keyof RequestDraft, value: string) {
    onChange({ ...state, draft: { ...draft, [field]: value } });
    setErrors((current) => ({ ...current, [field]: undefined }));
  }
  async function submit() {
    if (inFlight.current) return;
    const nextErrors = validatePreviewRequest(
      draft,
      PREVIEW_PRODUCTS.map((item) => item.id),
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>(
            '[aria-invalid="true"], [data-invalid="true"]',
          )
          ?.focus(),
      );
      return;
    }
    inFlight.current = true;
    setSending(true);
    setFailure(false);
    const payload = JSON.stringify(draft);
    const attempt =
      state.attempt?.payload === payload
        ? state.attempt
        : { payload, key: crypto.randomUUID() };
    onChange({ ...state, attempt });
    try {
      const receipt = await sendPreviewRequest(
        PREVIEW_CONTACT.requestEndpoint,
        draft,
        attempt.key,
      );
      const sent = { ...draft, productIds: [...draft.productIds] };
      onAccepted({
        receipt,
        draft: sent,
        products: products.map(({ id, name, model }) => ({ id, name, model })),
      });
      onChange({
        draft: { ...EMPTY_REQUEST.draft, productIds: [] },
        receipt,
        sent,
        attempt: null,
      });
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      setFailure(true);
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }
  if (state.receipt && state.sent)
    return (
      <RequestConfirmation
        receipt={state.receipt}
        sent={state.sent}
        onBrowse={onBrowse}
        onHistory={onHistory}
      />
    );
  return (
    <section className="pv-request-screen">
      <button className="pv-back-to-groups" onClick={onBack} disabled={sending}>
        <ArrowLeft aria-hidden="true" />
        Quay lại
      </button>
      <div className="pv-request-heading">
        <span className="pv-eyebrow">TRAO ĐỔI NHU CẦU CỦA BẠN</span>
        <h1>Gửi yêu cầu đặt hàng</h1>
        <p>Chọn sản phẩm và để lại thông tin để nhân viên tư vấn hỗ trợ bạn.</p>
      </div>
      <form
        ref={formRef}
        className="pv-request-layout"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className="pv-request-fields">
          <h2>Thông tin liên hệ</h2>
          <p className="pv-required-note">Các trường có dấu * cần được điền.</p>
          <label htmlFor="pv-name">
            Họ và tên <span aria-hidden="true">*</span>
            <input
              id="pv-name"
              name="name"
              autoComplete="name"
              maxLength={100}
              required
              disabled={sending}
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'pv-name-error' : undefined}
              placeholder="Nhập họ và tên của bạn"
            />
            {errors.name && (
              <span className="pv-field-error" id="pv-name-error">
                {errors.name}
              </span>
            )}
          </label>
          <label htmlFor="pv-phone">
            Số điện thoại <span aria-hidden="true">*</span>
            <input
              id="pv-phone"
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={24}
              required
              disabled={sending}
              value={draft.phone}
              onChange={(event) => update('phone', event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'pv-phone-error' : undefined}
              placeholder="Nhập số điện thoại liên hệ"
            />
            {errors.phone && (
              <span className="pv-field-error" id="pv-phone-error">
                {errors.phone}
              </span>
            )}
          </label>
          <div className="pv-request-product-picker">
            <div className="pv-library-toolbar">
              <h2>
                Sản phẩm quan tâm <span aria-hidden="true">*</span>
              </h2>
              <span>{products.length} sản phẩm</span>
            </div>
            <ul>
              {products.map((item) => (
                <li key={item.id}>
                  <span>
                    <strong>{item.model}</strong> · {item.name}
                  </span>
                </li>
              ))}
            </ul>
            <button
              id="pv-request-product"
              type="button"
              className="pv-button pv-button-outline"
              disabled={sending}
              onClick={onEditProducts}
              data-invalid={Boolean(errors.productIds)}
              aria-describedby={
                errors.productIds ? 'pv-product-error' : undefined
              }
            >
              {products.length
                ? 'Chỉnh sửa danh sách sản phẩm'
                : 'Chọn sản phẩm'}
            </button>
            {errors.productIds && (
              <span className="pv-field-error" id="pv-product-error">
                {errors.productIds}
              </span>
            )}
          </div>
          <label htmlFor="pv-note">
            Ghi chú <span className="pv-optional">(không bắt buộc)</span>
            <textarea
              id="pv-note"
              name="note"
              rows={4}
              maxLength={1000}
              disabled={sending}
              value={draft.note}
              onChange={(event) => update('note', event.target.value)}
              aria-invalid={Boolean(errors.note)}
              aria-describedby="pv-note-count"
              placeholder="Nhu cầu sử dụng hoặc nội dung bạn muốn được tư vấn"
            />
            <span className="pv-input-counter" id="pv-note-count">
              {draft.note.length}/1.000 ký tự
            </span>
            {errors.note && (
              <span className="pv-field-error">{errors.note}</span>
            )}
          </label>
          <div className="pv-data-use">
            <Info aria-hidden="true" />
            <p>
              Hoa Nam sử dụng thông tin bạn cung cấp để tiếp nhận yêu cầu và
              liên hệ tư vấn sản phẩm.{' '}
              <button type="button" onClick={() => setPrivacy(true)}>
                Xem cách sử dụng thông tin
              </button>
            </p>
          </div>
          {failure && (
            <div className="pv-submit-error" role="alert">
              <strong>Chưa gửi được yêu cầu</strong>
              <p>
                Thông tin bạn đã nhập vẫn được giữ lại. Vui lòng thử lại hoặc
                gọi hotline để được hỗ trợ.
              </p>
              <ContactLinks />
            </div>
          )}
          <button
            className="pv-button pv-submit-request"
            type="submit"
            disabled={sending}
          >
            {sending ? (
              <>
                <LoaderCircle className="pv-spin" aria-hidden="true" />
                Đang gửi yêu cầu…
              </>
            ) : (
              <>
                <Send aria-hidden="true" />
                {failure ? 'Gửi lại yêu cầu' : 'Gửi yêu cầu đặt hàng'}
              </>
            )}
          </button>
        </div>
        <aside className="pv-request-product">
          <h2>Sản phẩm của bạn</h2>
          {products.length ? (
            <div className="pv-request-summary-products">
              {products.map((product) => (
                <article key={product.id}>
                  <ProductPhoto
                    crop={product.image}
                    label={`${product.name} ${product.model}`}
                    hero
                  />
                  <div>
                    <AvailabilityBadge value={product.availability} />
                    <strong className="pv-detail-model">{product.model}</strong>
                    <h3>{product.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>Chọn sản phẩm để gửi cùng yêu cầu của bạn.</p>
          )}
          <div className="pv-request-direct">
            <h3>Cần tư vấn trực tiếp?</h3>
            <ContactLinks />
          </div>
        </aside>
      </form>
      {privacy && (
        <PreviewModal
          title="Sử dụng thông tin liên hệ"
          description="Thông tin được dùng để hỗ trợ yêu cầu của bạn."
          onClose={() => setPrivacy(false)}
        >
          <div className="pv-privacy-content">
            <p>
              Họ tên và số điện thoại giúp nhân viên tư vấn liên hệ với bạn. Sản
              phẩm và ghi chú giúp Hoa Nam hiểu nhu cầu và tư vấn phù hợp.
            </p>
            <p>
              Vui lòng chỉ cung cấp thông tin cần thiết cho việc tư vấn sản
              phẩm.
            </p>
            <button className="pv-button" onClick={() => setPrivacy(false)}>
              Đã hiểu
            </button>
          </div>
        </PreviewModal>
      )}
    </section>
  );
}
