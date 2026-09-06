'use client';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { PREVIEW_PRODUCTS } from '@/lib/product-preview';
import {
  EMPTY_LIBRARY,
  LIBRARY_STORAGE_KEY,
  readDeviceLibrary,
  recordRecent,
  toggleSaved,
  comparisonSelection,
  type DeviceLibrary,
} from '@/lib/preview-library';

type Snapshot = DeviceLibrary & { ready: boolean; persistent: boolean };
const serverSnapshot: Snapshot = {
  ...EMPTY_LIBRARY,
  ready: false,
  persistent: true,
};
let snapshot = serverSnapshot;
let cachedRaw: string | null | undefined;
const listeners = new Set<() => void>();
function readSnapshot(): Snapshot {
  if (!snapshot.persistent) return snapshot;
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (!snapshot.ready || raw !== cachedRaw) {
      cachedRaw = raw;
      snapshot = {
        ...readDeviceLibrary(raw, PREVIEW_PRODUCTS),
        ready: true,
        persistent: true,
      };
    }
  } catch {
    snapshot = { ...snapshot, ready: true, persistent: false };
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const sync = (event: StorageEvent) => {
    if (event.key === LIBRARY_STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener('storage', sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', sync);
  };
}
function updateLibrary(change: (value: DeviceLibrary) => DeviceLibrary) {
  const before = readSnapshot();
  const value = change(before);
  const next: Snapshot = {
    recent: value.recent,
    saved: value.saved,
    ready: true,
    persistent: before.persistent,
  };
  if (before.persistent) {
    try {
      // Whitelist the persisted fields: never persist context flags or customer details.
      const raw = JSON.stringify({ recent: next.recent, saved: next.saved });
      localStorage.setItem(LIBRARY_STORAGE_KEY, raw);
      cachedRaw = raw;
    } catch {
      next.persistent = false;
    }
  }
  snapshot = next;
  listeners.forEach((listener) => listener());
}
type LibraryContext = Snapshot & {
  compared: string[];
  notice: string;
  dismissNotice: () => void;
  save: (id: string) => void;
  visit: (id: string) => void;
  clearRecent: () => void;
  compare: (id: string) => void;
  clearComparison: () => void;
};
const Context = createContext<LibraryContext | null>(null);
export function PreviewLibraryProvider({ children }: { children: ReactNode }) {
  const library = useSyncExternalStore(
    subscribe,
    readSnapshot,
    () => serverSnapshot,
  );
  const [compared, setCompared] = useState<string[]>([]);
  const comparison = useRef<string[]>([]);
  const [notice, setNotice] = useState('');
  const visit = useCallback(
    (id: string) =>
      updateLibrary((value) => recordRecent(value, id, PREVIEW_PRODUCTS)),
    [],
  );
  const save = (id: string) =>
    updateLibrary((value) => toggleSaved(value, id, PREVIEW_PRODUCTS));
  const compare = (id: string) => {
    const result = comparisonSelection(
      comparison.current,
      id,
      PREVIEW_PRODUCTS,
    );
    comparison.current = result.ids;
    setCompared(result.ids);
    setNotice(
      result.error ??
        (result.ids.includes(id)
          ? 'Đã thêm sản phẩm vào danh sách so sánh.'
          : 'Đã bỏ sản phẩm khỏi danh sách so sánh.'),
    );
  };
  return (
    <Context.Provider
      value={{
        ...library,
        compared,
        notice,
        save,
        visit,
        compare,
        dismissNotice: () => setNotice(''),
        clearRecent: () => updateLibrary((value) => ({ ...value, recent: [] })),
        clearComparison: () => {
          comparison.current = [];
          setCompared([]);
          setNotice('Đã xóa lựa chọn so sánh.');
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePreviewLibrary() {
  const value = useContext(Context);
  if (!value) throw new Error('Preview library provider is required');
  return value;
}
