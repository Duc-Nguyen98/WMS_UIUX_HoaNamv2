'use client';
import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, ScanLine } from 'lucide-react';
import { guardRoute, parseRoute, routeHash, validSession, type ScannerRoute, type ScannerView, type ScannerSession, type ScannerAuthAdapter } from '@/lib/scanner-auth';
import { createPreviewAuth } from '@/lib/scanner-auth-preview';

export function useScannerAccess() {
  const [route,setRoute]=useState<ScannerRoute>({view:'login',id:'',product:''});
  const [session,setSession]=useState<ScannerSession|null>(null);
  const [loaded,setLoaded]=useState(false);
  const [message,setMessage]=useState('');
  const adapter=useRef<ScannerAuthAdapter|null>(null);
  const resume=useRef<ScannerRoute|null>(null);
  const sync=useRef<() => void>(()=>{});
  const trail=useRef<ScannerRoute[]>([]);
  const sessionId=useRef<string|null>(null);
  const leaveGuard=useRef<null|(()=>boolean)>(null);
  const lastHash=useRef('#login');
  useEffect(()=>{
    try { adapter.current=createPreviewAuth(window.sessionStorage); }
    catch { queueMicrotask(()=>{setMessage('Không thể mở phiên trên thiết bị này. Vui lòng cho phép lưu trữ phiên rồi tải lại.'); setLoaded(true);}); return; }
    const update=()=>{
      const next=adapter.current!.read();
      const requested=parseRoute(window.location.hash);
      if(next && window.location.hash!==lastHash.current && leaveGuard.current && !leaveGuard.current()){window.history.replaceState(null,'',lastHash.current);return;}
      const guarded=guardRoute(requested,next);
      if (routeHash(guarded)!==window.location.hash) window.history.replaceState(null,'',routeHash(guarded));
      sessionId.current=next?.userId||null;
      lastHash.current=routeHash(guarded);
      setSession(next); setRoute(guarded); setLoaded(true);
    };
    sync.current=update;
    update();
    const check=()=>{
      if (sessionId.current && !adapter.current!.read() && !['login','forgot'].includes(parseRoute(window.location.hash).view)) {
        resume.current=parseRoute(window.location.hash);
        setMessage('Phiên làm việc đã hết hạn. Nội dung đang soạn được giữ trong lần mở này. Đăng nhập lại để tiếp tục; tải lại trang sẽ bỏ bản đang soạn.');
      }
      update();
    };
    window.addEventListener('hashchange',check);
    window.addEventListener('popstate',check);
    window.addEventListener('focus',check);
    const timer=window.setInterval(check,1000);
    return ()=>{clearInterval(timer);window.removeEventListener('hashchange',check);window.removeEventListener('popstate',check);window.removeEventListener('focus',check);};
  },[]);
  const navigate=(view:ScannerView, context:Partial<ScannerRoute>={},replace=false)=>{
    const next=guardRoute({view,id:context.id||'',product:context.product||''},adapter.current?.read()||null);
    if(adapter.current?.read()&&routeHash(next)!==window.location.hash&&leaveGuard.current&&!leaveGuard.current())return false;
    lastHash.current=routeHash(next);
    if(!replace) trail.current.push(parseRoute(window.location.hash));
    window.history[replace?'replaceState':'pushState'](null,'',routeHash(next));
    sync.current();
    return true;
  };
  return {route,session,loaded,message, navigate,
    setLeaveGuard(fn:null|(()=>boolean)) {leaveGuard.current=fn;},
    actor:()=>adapter.current?.read()||null,
    changePreviewRole(role:string) {adapter.current?.changePreviewRole(role);sync.current();},
    back() { const dest=trail.current.at(-1); if(navigate(dest?.view||'home',dest||{},true))trail.current.pop(); },
    allowed:loaded && validSession(session) && session.shiftStarted && !['login','forgot','shift'].includes(route.view),
    check:()=>validSession(adapter.current?.read()||null) && !!adapter.current?.read()?.shiftStarted,
    async login(id:string,password:string,scenario:string,role:string) {
      if (!adapter.current) throw new Error('Chưa thể khởi tạo phiên trên thiết bị này.');
      await adapter.current.login(id,password,scenario,role); navigate('shift',{},true);
    },
    startShift() {
      adapter.current!.startShift();
      const dest=resume.current; resume.current=null; setMessage('');
      navigate(dest?.view||'home',dest||{},true);
    },
    logout(message='Bạn đã đăng xuất an toàn.') {adapter.current?.logout();resume.current=null;trail.current=[];setMessage(message);navigate('login',{},true);},
    expire() {adapter.current?.logout();resume.current=route;setMessage('Phiên làm việc đã hết hạn. Nội dung đang soạn được giữ trong lần mở này. Đăng nhập lại để tiếp tục; tải lại trang sẽ bỏ bản đang soạn.');navigate('login',{},true);},
  };
}

export function ScannerAuthScreen({access,role}:{access:ReturnType<typeof useScannerAccess>;role:string}) {
  const [identifier,setIdentifier]=useState('');
  const [password,setPassword]=useState('');
  const [visible,setVisible]=useState(false);
  const [errors,setErrors]=useState({identifier:'',password:''});
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [scenario,setScenario]=useState('normal');
  const lock=useRef(false);
  const idRef=useRef<HTMLInputElement>(null);
  const passRef=useRef<HTMLInputElement>(null);
  const view=access.route.view;
  return <div className="sc-auth-wrap">
    <main className="sc-auth" aria-busy={busy}>
      <div className="sc-auth-brand"><span><ScanLine aria-hidden="true" /></span><strong>HOA NAM <small>SCANNER</small></strong></div>
      {!access.loaded ? <output>Đang kiểm tra phiên làm việc…</output> : view==='shift' ? <>
        <h1>Bắt đầu ca làm việc</h1><p>Kiểm tra thông tin của bạn trước khi vào ca.</p>
        <dl><dt>Nhân viên</dt><dd>{access.session?.name}</dd><dt>Vai trò</dt><dd>{access.session?.role}</dd><dt>Kho làm việc</dt><dd>Kho Hoa Nam</dd></dl>
        <button className="sc-btn" onClick={()=>{try{access.startShift();}catch{access.expire();}}}>Bắt đầu ca làm việc</button>
        <button className="sc-btn secondary" onClick={()=>access.logout()}>Đăng xuất</button>
      </> : view==='forgot' ? <>
        <h1>Quên mật khẩu</h1><p>Vui lòng liên hệ quản trị viên đã cấp tài khoản để được hỗ trợ khôi phục quyền truy cập.</p><p>Không chia sẻ mật khẩu hoặc mã xác thực với người khác.</p>
        <button className="sc-btn" onClick={()=>access.navigate('login',{},true)}>Quay lại đăng nhập</button>
      </> : <>
        <h1>Đăng nhập Hoa Nam Scanner</h1><p>Đăng nhập bằng tài khoản được cấp để làm việc tại Kho Hoa Nam.</p>
        {access.message && <output><p className="sc-auth-message">{access.message}</p></output>}
        <form noValidate onSubmit={async e=>{
          e.preventDefault();if(lock.current)return;
          const next={identifier:identifier.trim()?'':'Vui lòng nhập tên đăng nhập, email hoặc số điện thoại.',password:password?'':'Vui lòng nhập mật khẩu.'};setErrors(next);setError('');
          if(next.identifier||next.password){(next.identifier?idRef:passRef).current?.focus();return;}
          lock.current=true;setBusy(true);
          try{await access.login(identifier,password,navigator.onLine?scenario:'offline',role);}
          catch(err){setError(err instanceof Error?err.message:'Không thể đăng nhập. Vui lòng thử lại.');passRef.current?.focus();}
          finally{setPassword('');setVisible(false);setBusy(false);lock.current=false;}
        }}>
          <label htmlFor="sc-auth-id">Tên đăng nhập, email hoặc số điện thoại</label>
          <input id="sc-auth-id" ref={idRef} autoComplete="username" autoCapitalize="none" spellCheck={false} value={identifier} disabled={busy} onChange={e=>setIdentifier(e.target.value)} aria-invalid={!!errors.identifier} aria-describedby={errors.identifier?'sc-auth-id-error':undefined}/>
          {errors.identifier&&<p className="sc-auth-error" id="sc-auth-id-error">{errors.identifier}</p>}
          <label htmlFor="sc-auth-password">Mật khẩu</label>
          <div className="sc-auth-password"><input id="sc-auth-password" ref={passRef} type={visible?'text':'password'} autoComplete="current-password" value={password} disabled={busy} onChange={e=>setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby={errors.password?'sc-auth-password-error':undefined}/><button type="button" disabled={busy} aria-label={visible?'Ẩn mật khẩu':'Hiện mật khẩu'} aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible?<EyeOff/>:<Eye/>}</button></div>
          {errors.password&&<p className="sc-auth-error" id="sc-auth-password-error">{errors.password}</p>}
          <button type="button" className="sc-auth-forgot" disabled={busy} onClick={()=>access.navigate('forgot')}>Quên mật khẩu?</button>
          {error&&<p role="alert" className="sc-auth-error">{error}</p>}
          <button className="sc-btn" type="submit" disabled={busy}>{busy?'Đang đăng nhập…':'Đăng nhập'}</button>
        </form>
      </>}
    </main>
    {view==='login'&&<details className="sc-auth-harness"><summary>Thiết lập kiểm thử xác thực</summary><p>Chỉ dùng tài khoản giả: minhanh / Scanner@2026. Không nhập tài khoản thật. Đây không phải xác thực máy chủ.</p><label>Kịch bản đăng nhập<select value={scenario} onChange={e=>setScenario(e.target.value)} disabled={busy}>{[['normal','Bình thường'],['invalid','Sai thông tin'],['locked','Tài khoản bị khóa'],['disabled','Tài khoản vô hiệu hóa'],['offline','Mất mạng'],['server','Lỗi máy chủ']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label></details>}
  </div>;
}
