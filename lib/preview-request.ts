// DEV integration contract. No destination may be guessed from a telephone number.
export const PREVIEW_CONTACT: {
  phone: string;
  phoneDisplay: string;
  zaloUrl: string | null;
  requestEndpoint: string | null;
} = {
  phone: '0986366675',
  phoneDisplay: '098 636 6675',
  zaloUrl: null,
  requestEndpoint: null,
};

export type RequestDraft = {
  name: string;
  phone: string;
  productIds: string[];
  note: string;
};
export type RequestErrors = Partial<Record<keyof RequestDraft, string>>;
export type RequestReceipt = { accepted: true; requestId: string };
export type RequestState = {
  draft: RequestDraft;
  receipt: RequestReceipt | null;
  sent: RequestDraft | null;
  attempt: { payload: string; key: string } | null;
};
export const EMPTY_REQUEST: RequestState = {
  draft: { name: '', phone: '', productIds: [], note: '' },
  receipt: null,
  sent: null,
  attempt: null,
};

export function validatePreviewRequest(
  draft: RequestDraft,
  productIds: readonly string[],
): RequestErrors {
  const errors: RequestErrors = {};
  if (!draft.name.trim()) errors.name = 'Vui lòng nhập họ và tên.';
  else if (draft.name.trim().length > 100)
    errors.name = 'Họ và tên tối đa 100 ký tự.';
  const phone = draft.phone.replace(/[\s().-]/g, '');
  if (!/^(?:0\d{9}|\+84\d{9})$/.test(phone))
    errors.phone = 'Nhập số điện thoại gồm 10 chữ số hoặc bắt đầu bằng +84.';
  if (
    !draft.productIds.length ||
    draft.productIds.some((id) => !productIds.includes(id)) ||
    new Set(draft.productIds).size !== draft.productIds.length
  )
    errors.productIds =
      'Vui lòng chọn sản phẩm cần tư vấn và không chọn trùng.';
  if (draft.note.length > 1000) errors.note = 'Ghi chú tối đa 1.000 ký tự.';
  return errors;
}

export async function sendPreviewRequest(
  endpoint: string | null,
  draft: RequestDraft,
  requestKey: string,
  transport: typeof fetch = fetch,
): Promise<RequestReceipt> {
  if (!endpoint) throw new Error('unavailable');
  const response = await transport(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': requestKey,
    },
    body: JSON.stringify({
      productIds: [...draft.productIds],
      name: draft.name.trim(),
      phone: draft.phone.replace(/[\s().-]/g, ''),
      note: draft.note.trim(),
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('not-accepted');
  const receipt: unknown = await response.json();
  if (
    !receipt ||
    typeof receipt !== 'object' ||
    !('accepted' in receipt) ||
    receipt.accepted !== true ||
    !('requestId' in receipt) ||
    typeof receipt.requestId !== 'string' ||
    !receipt.requestId.trim()
  ) {
    throw new Error('unconfirmed');
  }
  return { accepted: true, requestId: receipt.requestId };
}

export type SentRequest = {
  receipt: RequestReceipt;
  draft: RequestDraft;
  products: { id: string; name: string; model: string }[];
};
// Records are held only in the current page's memory after verified acceptance.
export function rememberAcceptedRequest(
  records: SentRequest[],
  record: SentRequest,
): SentRequest[] {
  return [
    {
      receipt: { ...record.receipt },
      draft: { ...record.draft, productIds: [...record.draft.productIds] },
      products: record.products.map((product) => ({ ...product })),
    },
    ...records.filter(
      (item) => item.receipt.requestId !== record.receipt.requestId,
    ),
  ];
}
