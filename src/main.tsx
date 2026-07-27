import './index.css';
import './language-bootstrap';
import React, { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Loader2, Lock, LogIn, LogOut, Mail, ShieldCheck, X } from 'lucide-react';
import App from './App';
import { db } from './lib/db';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean; error: Error | null };

type EmailTemplate = {
  template_key: string;
  name: string;
  subject: string;
  body: string;
};

type Booking = {
  reference: string;
  name: string;
  email: string;
  pickup: string;
  dropoff: string;
  travel_date: string;
  travel_time: string;
  service: string;
  vehicle: string;
  total: number;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): ErrorBoundaryState { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error('Qatar Rental application error:', error, errorInfo); }
  render() {
    if (this.state.hasError) return <main className="flex min-h-screen items-center justify-center bg-[#f5f5f2] px-5 py-12"><section className="w-full max-w-lg rounded-2xl border border-[#e4e3df] bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-sm font-bold text-white">QR</div><p className="mt-7 text-xs font-semibold uppercase tracking-[.18em] text-[#a88b60]">Qatar Rental</p><h1 className="mt-3 font-display text-3xl font-semibold">We are refreshing the experience.</h1><p className="mt-4 text-sm leading-6 text-stone-500">Something prevented the page from loading correctly. Please reload the page to try again.</p><button type="button" onClick={() => window.location.reload()} className="mt-7 min-h-12 rounded-lg bg-[#151515] px-6 py-3 text-sm font-semibold text-white">Reload page</button></section></main>;
    return this.props.children;
  }
}

function OperationsLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [email, setEmail] = useState('admin@qatar-car-rental.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const rows = await db.select<{ id: number; email: string }>('admin_users', `?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&password=eq.${encodeURIComponent(password)}&active=eq.true&limit=1`);
      if (!rows.length) { setError('The email or password is incorrect.'); return; }
      sessionStorage.setItem('qatar-rental-admin', 'true'); onAuthenticated();
    } catch { setError('We could not verify your account. Please try again.'); }
    finally { setLoading(false); }
  };
  return <main className="flex min-h-screen items-center justify-center bg-[#171717] px-5 py-10"><section className="w-full max-w-md rounded-2xl border border-[#e4e3df] bg-white p-7 shadow-2xl sm:p-10"><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#151515] text-sm font-bold text-white">QR</div><a href="/" className="text-xs font-semibold text-stone-500 underline underline-offset-4">Return to website</a></div><p className="mt-8 text-xs font-semibold uppercase tracking-[.18em] text-[#a88b60]">Qatar Rental Operations</p><h1 className="mt-3 font-display text-3xl font-semibold">Admin sign in</h1><p className="mt-3 text-sm leading-6 text-stone-500">Sign in to manage booking requests, fleet operations and chauffeur assignments.</p><form onSubmit={signIn} className="mt-7 space-y-5"><div><label className="label" htmlFor="admin-email">Email address</label><input id="admin-email" className="input" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" required /></div><div><label className="label" htmlFor="admin-password">Password</label><div className="relative"><Lock size={16} className="absolute left-3 top-4 text-stone-400" /><input id="admin-password" className="input pl-10" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" placeholder="Enter your password" required /></div></div>{error && <p className="text-sm text-red-600">{error}</p>}<button type="submit" disabled={loading} className="flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-4 text-sm font-semibold text-white disabled:opacity-50">{loading ? <Loader2 size={17} className="animate-spin" /> : <LogIn size={17} />}{loading ? 'Verifying account...' : 'Sign in'}</button></form><div className="mt-6 flex gap-3 rounded-xl bg-mist p-4 text-xs leading-5 text-stone-500"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-sand" /><span>This area is restricted to authorized Qatar Rental administrators.</span></div></section></main>;
}

function renderTemplate(value: string, booking: Booking) {
  const replacements: Record<string, string> = {
    customer_name: booking.name || 'customer',
    reference: booking.reference,
    vehicle: booking.vehicle,
    service: booking.service,
    pickup: booking.pickup,
    dropoff: booking.dropoff,
    travel_date: booking.travel_date,
    travel_time: booking.travel_time,
    total: Number(booking.total || 0).toFixed(2),
  };
  return value.replace(/{{\s*([a-z_]+)\s*}}/gi, (_, key: string) => replacements[key.toLowerCase()] ?? '');
}

function AdminEmailActions() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [sending, setSending] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(true);

  useEffect(() => {
    db.select<EmailTemplate>('email_templates', '?active=eq.true&order=template_key.asc').then(setTemplates).catch(error => console.error('Could not load email templates:', error));
    const findBooking = () => {
      const text = document.body.innerText;
      const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
      const reference = text.match(/QR-[A-Z0-9]+/i)?.[0] || '';
      if (!email || !reference) return;
      db.select<Booking>('bookings', `?reference=eq.${encodeURIComponent(reference)}&limit=1`).then(rows => {
        if (rows[0]) setBooking(rows[0]);
      }).catch(() => undefined);
    };
    findBooking();
    const observer = new MutationObserver(findBooking);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const sendEmail = async (template: EmailTemplate) => {
    if (!booking) { setMessage('Select a booking before sending an email.'); return; }
    setSending(template.template_key); setMessage('');
    try {
      const subject = renderTemplate(template.subject, booking);
      const body = renderTemplate(template.body, booking);
      await db.insert('email_outbox', {
        booking_reference: booking.reference,
        recipient_email: booking.email,
        template_key: template.template_key,
        subject,
        body,
        status: 'Queued',
      });
      setMessage(`Email queued for ${booking.email}.`);
    } catch (error) {
      console.error('Could not queue booking email:', error);
      setMessage('The email could not be queued. Please try again.');
    } finally { setSending(''); }
  };

  if (!open) return <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 left-5 z-[90] inline-flex items-center gap-2 rounded-full bg-[#151515] px-4 py-3 text-xs font-semibold text-white shadow-xl"><Mail size={15} />Booking emails</button>;
  return <aside className="fixed bottom-5 left-5 z-[90] w-[min(380px,calc(100vw-2.5rem))] rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a88b60]">Customer communication</p><h2 className="mt-1 text-lg font-semibold text-[#151515]">Booking emails</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Close email panel" className="text-stone-400 hover:text-stone-700"><X size={17} /></button></div><div className="mt-4 rounded-xl bg-stone-50 p-3 text-xs leading-5 text-stone-600"><strong className="text-stone-900">{booking?.reference || 'No booking selected'}</strong><br />{booking?.email || 'Open a booking to load the customer email.'}</div><div className="mt-4 space-y-2">{templates.map(template => <button key={template.template_key} type="button" disabled={!booking || Boolean(sending)} onClick={() => sendEmail(template)} className="flex min-h-11 w-full items-center justify-between rounded-lg border border-stone-200 px-3 text-left text-xs font-semibold text-stone-800 transition hover:border-[#a88b60] hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"><span className="flex items-center gap-2"><Mail size={15} className="text-[#a88b60]" />{template.name}</span>{sending === template.template_key && <Loader2 size={15} className="animate-spin" />}</button>)}</div>{message && <p className={`mt-3 text-xs leading-5 ${message.includes('could not') ? 'text-red-600' : 'text-emerald-700'}`}>{message}</p>}<p className="mt-3 text-[11px] leading-4 text-stone-400">Emails are queued in the outbox. Connect the production email provider to deliver them automatically.</p></aside>;
}

function AdminGuard({ children }: { children: ReactNode }) {
  const operationsPath = window.location.pathname.replace(/\/$/, '') === '/operations';
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('qatar-rental-admin') === 'true');
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `header button.qr-hidden-operations{display:none!important} footer .qr-admin-link{color:#a8a39a;text-decoration:underline;text-underline-offset:3px}`;
    document.head.appendChild(style);
    const update = () => {
      document.querySelectorAll('header button').forEach(button => { const label = button.textContent?.trim().toLowerCase() || ''; if (label === 'operations' || label === 'operations dashboard' || label === 'العمليات' || label === 'لوحة العمليات') button.classList.add('qr-hidden-operations'); });
      const copyright = document.querySelector('footer .mt-12.border-t');
      if (copyright && !copyright.querySelector('.qr-admin-link')) { const link = document.createElement('a'); link.href = '/operations'; link.className = 'qr-admin-link ml-3 inline-block'; link.textContent = 'Admin - Operations'; copyright.appendChild(link); }
    };
    update(); const observer = new MutationObserver(update); observer.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); document.head.removeChild(style); };
  }, []);
  useEffect(() => { if (!operationsPath) return; document.body.classList.add('qr-operations'); const style = document.createElement('style'); style.textContent = 'body.qr-operations header,body.qr-operations footer{display:none!important}'; document.head.appendChild(style); return () => { document.body.classList.remove('qr-operations'); style.remove(); }; }, [operationsPath]);
  useEffect(() => { if (!operationsPath || !authenticated) return; const timer = window.setTimeout(() => { const button = Array.from(document.querySelectorAll('button')).find(item => ['Operations', 'العمليات'].includes(item.textContent?.trim() || '')); if (button) button.click(); }, 50); return () => window.clearTimeout(timer); }, [operationsPath, authenticated]);
  const signOut = () => { sessionStorage.removeItem('qatar-rental-admin'); setAuthenticated(false); };
  if (operationsPath && !authenticated) return <OperationsLogin onAuthenticated={() => setAuthenticated(true)} />;
  return <>{children}{operationsPath && authenticated && <><AdminEmailActions /><button type="button" onClick={signOut} className="fixed bottom-5 right-5 z-[90] inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-[#151515] px-4 py-3 text-xs font-semibold text-white shadow-xl"><LogOut size={15} />Sign out</button></>}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><AdminGuard><App /></AdminGuard></ErrorBoundary></React.StrictMode>);
