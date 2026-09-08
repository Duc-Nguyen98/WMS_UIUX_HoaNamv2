'use client';
import { Component, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { ContactLinks } from '@/components/preview-contact';

export default class PreviewScreenBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="pv-empty">
        <h1>Chưa tải được nội dung</h1>
        <p>Vui lòng kiểm tra kết nối và thử lại.</p>
        <button className="pv-button" onClick={() => window.location.reload()}>
          <RefreshCw aria-hidden="true" />
          Thử lại
        </button>
        <ContactLinks />
      </section>
    );
  }
}
