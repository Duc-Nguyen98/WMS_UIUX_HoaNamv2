import { authErrors, validSession, type ScannerAuthAdapter, type ScannerSession } from './scanner-auth';

// Only imported by the Scanner preview. No credential/token is persisted.
// sessionStorage contains synthetic UI-session claims, not authentication proof.
export function createPreviewAuth(storage: Pick<Storage,'getItem'|'setItem'|'removeItem'>): ScannerAuthAdapter {
  const key = 'hoanam-scanner-preview-session-v1';
  const read = () => {
    try {
      const s = JSON.parse(storage.getItem(key) || 'null') as ScannerSession | null;
      return validSession(s) ? s : null;
    } catch { return null; }
  };
  return {
    read,
    async login(identifier, password, scenario, role) {
      await new Promise(resolve => setTimeout(resolve,450));
      if (authErrors[scenario]) throw new Error(authErrors[scenario]);
      // Public synthetic fixtures for design review only. Never enter real credentials.
      if (!['minhanh','minhanh@example.test','0900000000'].includes(identifier.trim().toLowerCase()) || password !== 'Scanner@2026') throw new Error(authErrors.invalid);
      const s: ScannerSession = {userId:'preview-minhanh',name:'Minh Anh',role,expiresAt:Date.now()+30*60*1000,shiftStarted:false};
      storage.setItem(key,JSON.stringify(s));
      return s;
    },
    startShift() {
      const s=read(); if (!s) throw new Error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
      const next={...s,shiftStarted:true}; storage.setItem(key,JSON.stringify(next)); return next;
    },
    logout() { storage.removeItem(key); },
  };
}
