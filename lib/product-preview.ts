/**
 * UI prototype only. Names, models and image viewports are transcribed from
 * the supplied AppPV_UIUX_Audit screenshots (04 and 07); no production API.
 * Every availability value is a synthetic UI fixture, NOT an inventory fact.
 * Keep these records separate from WMS fixtures and from future public APIs.
 */
export type Availability = 'ready' | 'preorder';
export type ProductGroup = 'machine' | 'hand' | 'accessory';
export type ProductCategory =
  | 'clamping'
  | 'construction'
  | 'cutting'
  | 'drilling'
  | 'garden-power'
  | 'grinding'
  | 'planing'
  | 'other-power'
  | 'electrical'
  | 'fastening'
  | 'garden-hand'
  | 'hydraulic';
export type PreviewView =
  | 'home'
  | 'groups'
  | 'catalog'
  | 'search'
  | 'detail'
  | 'contact'
  | 'request'
  | 'recent'
  | 'saved'
  | 'help'
  | 'selection'
  | 'requests'
  | 'compare';
export type ProductImage = {
  source: 'detail' | 'list';
  x: number;
  y: number;
  width: number;
  height: number;
};
export type PreviewProduct = {
  id: string;
  name: string;
  model: string;
  group: ProductGroup;
  category: ProductCategory;
  availability: Availability;
  image: ProductImage;
  description?: string;
  images?: readonly ProductImage[];
  specifications?: readonly { label: string; value: string }[];
};

export const PREVIEW_GROUPS = [
  {
    id: 'machine',
    name: 'Máy công cụ',
    title: 'Máy và thiết bị động lực',
    description: 'Pin, điện AC, khí nén',
  },
  {
    id: 'hand',
    name: 'Dụng cụ cầm tay',
    title: 'Dụng cụ cầm tay',
    description: 'Kẹp, siết, đo, cắt',
  },
  {
    id: 'accessory',
    name: 'Phụ kiện',
    title: 'Phụ tùng và phụ kiện',
    description: 'Pin, sạc, mũi và lưỡi',
  },
] as const;

// Group/category relationships transcribed from screenshots 02 and 03.
// No accessory child taxonomy was supplied; keep its list empty until provided.
export const PREVIEW_CATEGORIES = [
  { id: 'construction', name: 'Bê tông và xây dựng', group: 'machine' },
  { id: 'drilling', name: 'Khoan và siết/vặn', group: 'machine' },
  { id: 'garden-power', name: 'Thiết bị làm vườn', group: 'machine' },
  { id: 'grinding', name: 'Mài và đánh bóng', group: 'machine' },
  { id: 'planing', name: 'Bào và phay', group: 'machine' },
  { id: 'other-power', name: 'Thiết bị động lực khác', group: 'machine' },
  { id: 'clamping', name: 'Dụng cụ kẹp giữ', group: 'hand' },
  { id: 'cutting', name: 'Dụng cụ cắt', group: 'hand' },
  { id: 'electrical', name: 'Dụng cụ điện', group: 'hand' },
  { id: 'fastening', name: 'Dụng cụ siết/vặn', group: 'hand' },
  { id: 'garden-hand', name: 'Dụng cụ làm vườn cầm tay', group: 'hand' },
  { id: 'hydraulic', name: 'Dụng cụ thủy lực', group: 'hand' },
] as const;

// Preserve the four homepage shortcuts and their original order.
export const PREVIEW_HOME_CATEGORIES = [
  'clamping',
  'construction',
  'cutting',
  'drilling',
].map((id) => PREVIEW_CATEGORIES.find((category) => category.id === id)!);

export function previewCategoriesForGroup(group: ProductGroup | 'all') {
  return PREVIEW_CATEGORIES.filter(
    (category) => group === 'all' || category.group === group,
  );
}

export function previewGroupFilters(
  group: ProductGroup,
  category: ProductCategory | 'all' = 'all',
): PreviewFilters {
  return {
    ...DEFAULT_PREVIEW_FILTERS,
    group,
    category: previewCategoriesForGroup(group).some(
      (item) => item.id === category,
    )
      ? category
      : 'all',
  };
}

export const PREVIEW_PRODUCTS: readonly PreviewProduct[] = [
  {
    id: 'dczc02-26',
    model: 'DCZC02-26',
    name: 'Khoan búa dùng pin không chổi than',
    group: 'machine',
    category: 'drilling',
    availability: 'ready',
    image: { source: 'detail', x: 96, y: 218, width: 520, height: 320 },
    description:
      'Động cơ không chổi than. Công nghệ kiểm soát an toàn DSC, ly hợp cơ và bảo vệ điện tử. Điều khiển tốc độ không đổi điện tử. Vận hành 3 chế độ: khoan, búa xoay và phá dỡ.',
  },
  {
    id: 'dzg02-11',
    model: 'DZG02-11',
    name: 'Búa phá dỡ điện',
    group: 'machine',
    category: 'construction',
    availability: 'ready',
    image: { source: 'list', x: 33, y: 317, width: 310, height: 180 },
  },
  {
    id: 'dzg02-15',
    model: 'DZG02-15',
    name: 'Búa phá dỡ điện',
    group: 'machine',
    category: 'construction',
    availability: 'preorder',
    image: { source: 'list', x: 401, y: 314, width: 270, height: 180 },
  },
  {
    id: 'dzg03-15',
    model: 'DZG03-15',
    name: 'Búa phá dỡ điện',
    group: 'machine',
    category: 'construction',
    availability: 'ready',
    image: { source: 'list', x: 60, y: 708, width: 257, height: 144 },
  },
  {
    id: 'dzg06-15',
    model: 'DZG06-15',
    name: 'Búa phá dỡ điện',
    group: 'machine',
    category: 'construction',
    availability: 'preorder',
    image: { source: 'list', x: 419, y: 700, width: 207, height: 178 },
  },
  {
    id: 'dzg06-6s',
    model: 'DZG06-6S',
    name: 'Búa phá dỡ điện',
    group: 'machine',
    category: 'construction',
    availability: 'ready',
    image: { source: 'list', x: 64, y: 1090, width: 247, height: 151 },
  },
  {
    id: 'dzg07-6',
    model: 'DZG07-6',
    name: 'Búa phá dỡ điện',
    group: 'machine',
    category: 'construction',
    availability: 'ready',
    image: { source: 'list', x: 413, y: 1090, width: 248, height: 151 },
  },
];

export type PreviewFilters = {
  query: string;
  group: ProductGroup | 'all';
  category: ProductCategory | 'all';
  availability: Availability | 'all';
  sort: 'default' | 'name';
};
export const DEFAULT_PREVIEW_FILTERS: PreviewFilters = {
  query: '',
  group: 'all',
  category: 'all',
  availability: 'all',
  sort: 'default',
};

export function normalizePreviewSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export function filterPreviewProducts(
  products: readonly PreviewProduct[],
  filters: PreviewFilters,
) {
  const modelQuery = normalizePreviewSearch(filters.query).replace(
    /[^a-z0-9]/g,
    '',
  );
  const exactModel = (product: PreviewProduct) =>
    Boolean(modelQuery) &&
    normalizePreviewSearch(product.model).replace(/[^a-z0-9]/g, '') ===
      modelQuery;
  const words = normalizePreviewSearch(filters.query)
    .split(/\s+/)
    .filter(Boolean);
  const result = products.filter((product) => {
    const searchable = normalizePreviewSearch(
      [
        product.name,
        product.model,
        product.description ?? '',
        PREVIEW_GROUPS.find((group) => group.id === product.group)?.name,
        PREVIEW_CATEGORIES.find((category) => category.id === product.category)
          ?.name,
      ].join(' '),
    );
    return (
      (exactModel(product) ||
        words.every((word) => searchable.includes(word))) &&
      (filters.group === 'all' || product.group === filters.group) &&
      (filters.category === 'all' || product.category === filters.category) &&
      (filters.availability === 'all' ||
        product.availability === filters.availability)
    );
  });
  return filters.sort === 'name'
    ? result.sort((a, b) =>
        `${a.name} ${a.model}`.localeCompare(`${b.name} ${b.model}`, 'vi', {
          numeric: true,
        }),
      )
    : result.sort((a, b) => Number(exactModel(b)) - Number(exactModel(a)));
}

export function parsePreviewLocation(hash: string): {
  view: PreviewView;
  filters: PreviewFilters;
  productId: string | null;
} {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const view = params.get('view');
  const group = params.get('group');
  const category = params.get('category');
  const availability = params.get('status');
  const productId = params.get('product');
  return {
    view:
      view === 'groups' ||
      view === 'catalog' ||
      view === 'contact' ||
      view === 'search' ||
      view === 'detail' ||
      view === 'request' ||
      view === 'recent' ||
      view === 'saved' ||
      view === 'help' ||
      view === 'selection' ||
      view === 'requests' ||
      view === 'compare'
        ? view
        : 'home',
    filters: {
      query: params.get('q') ?? '',
      group: PREVIEW_GROUPS.some((item) => item.id === group)
        ? (group as ProductGroup)
        : 'all',
      category: PREVIEW_CATEGORIES.some(
        (item) =>
          item.id === category &&
          (!PREVIEW_GROUPS.some((entry) => entry.id === group) ||
            item.group === group),
      )
        ? (category as ProductCategory)
        : 'all',
      availability:
        availability === 'ready' || availability === 'preorder'
          ? availability
          : 'all',
      sort: params.get('sort') === 'name' ? 'name' : 'default',
    },
    productId:
      (view === 'detail' && productId) ||
      PREVIEW_PRODUCTS.some((product) => product.id === productId)
        ? productId
        : null,
  };
}

export function previewHash(
  view: PreviewView,
  filters: PreviewFilters,
  productId?: string | null,
) {
  const params = new URLSearchParams({ view });
  if (filters.query) params.set('q', filters.query);
  if (filters.group !== 'all') params.set('group', filters.group);
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.availability !== 'all')
    params.set('status', filters.availability);
  if (filters.sort !== 'default') params.set('sort', filters.sort);
  if (productId) params.set('product', productId);
  return `#${params.toString()}`;
}
