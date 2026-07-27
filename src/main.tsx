import './index.css';
import './language-bootstrap';
import React, { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart3, Bell, CalendarDays, Check, ChevronRight, Car, CheckCircle2, Clock3, FileText, LayoutDashboard, Loader2, Lock, LogIn, LogOut, Mail, Menu, Search, Settings, ShieldCheck, Users, X, XCircle } from 'lucide-react';
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
  id?: number;
  reference: string;
  name: string;
  email: string;
  phone?: string;
  pickup: string;
  dropoff: string;
  travel_date: string;
  travel_time: string;
  service: string;
  vehicle: string;
  passengers?: number;
  total: number;
  status: string;
  payment_status?: string;
  created_at?: string;
  notes?: string;
};

type Vehicle = {
  id?: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  hourly_price: number;
  image: string;
  badge?: string;
  passengers: number;
  luggage: number;
  service_mode: string;
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
  const replacements: Record<string, string> = { customer_name: booking.name || 'customer', reference: booking.reference, vehicle: booking.vehicle, service: booking.service, pickup: booking.pickup, dropoff: booking.dropoff, travel_date: booking.travel_date, travel_time: booking.travel_time, total: Number(booking.total || 0).toFixed(2) };
  return value.replace(/{{\s*([a-z_]+)\s*}}/gi, (_, key: string) => replacements[key.toLowerCase()] ?? '');
}

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'bookings', label: 'Bookings', icon: CalendarDays },
  { key: 'fleet', label: 'Fleet inventory', icon: Car },
  { key: 'emails', label: 'Email templates', icon: Mail },
  { key: 'settings', label: 'Settings', icon: Settings },
];

function statusClass(status: string) {
  if (status === 'Approved') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Rejected' || status === 'Cancelled') return 'bg-red-50 text-red-700';
  if (status === 'Completed') return 'bg-blue-50 text-blue-700';
  return 'bg-amber-50 text-amber-700';
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState('');
  const [notice, setNotice] = useState('');
  const [mobileNav, setMobileNav] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingRows, vehicleRows, templateRows] = await Promise.all([
        db.select<Booking>('bookings', '?order=created_at.desc'),
        db.select<Vehicle>('vehicles', '?order=name.asc'),
        db.select<EmailTemplate>('email_templates', '?active=eq.true&order=template_key.asc'),
      ]);
      setBookings(bookingRows); setVehicles(vehicleRows); setTemplates(templateRows);
    } catch (error) { console.error('Could not load operations data:', error); setNotice('Some dashboard data could not be loaded.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const filteredBookings = useMemo(() => bookings.filter(booking => {
    const haystack = `${booking.reference} ${booking.name} ${booking.email} ${booking.vehicle} ${booking.pickup} ${booking.dropoff}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (statusFilter === 'All' || booking.status === statusFilter);
  }), [bookings, search, statusFilter]);

  const counts = useMemo(() => ({ total: bookings.length, pending: bookings.filter(item => item.status === 'Pending approval').length, approved: bookings.filter(item => item.status === 'Approved').length, completed: bookings.filter(item => item.status === 'Completed').length }), [bookings]);

  const updateStatus = async (booking: Booking, status: string) => {
    setUpdating(booking.reference); setNotice('');
    try {
      await db.update('bookings', `?reference=eq.${encodeURIComponent(booking.reference)}`, { status, updated_at: new Date().toISOString() });
      setBookings(current => current.map(item => item.reference === booking.reference ? { ...item, status } : item));
      setSelectedBooking(current => current?.reference === booking.reference ? { ...current, status } : current);
      setNotice(`Booking ${booking.reference} updated to ${status}.`);
    } catch { setNotice('The booking status could not be updated.'); }
    finally { setUpdating(''); }
  };

  const sendEmail = async (template: EmailTemplate) => {
    if (!selectedBooking) return;
    setUpdating(template.template_key); setNotice('');
    try {
      await db.insert('email_outbox', { booking_reference: selectedBooking.reference, recipient_email: selectedBooking.email, template_key: template.template_key, subject: renderTemplate(template.subject, selectedBooking), body: renderTemplate(template.body, selectedBooking), status: 'Queued' });
      setNotice(`Email queued for ${selectedBooking.email}.`);
    } catch { setNotice('The email could not be queued.'); }
    finally { setUpdating(''); }
  };

  const metricCards = [
    { label: 'Total bookings', value: counts.total, icon: BarChart3, tone: 'bg-stone-100 text-stone-700' },
    { label: 'Awaiting approval', value: counts.pending, icon: Clock3, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Approved', value: counts.approved, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Completed', value: counts.completed, icon: Check, tone: 'bg-blue-50 text-blue-700' },
  ];

  return <div className="min-h-screen bg-[#f5f5f2] text-[#171717]">
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-stone-200 bg-[#171717] px-5 py-6 text-white transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between"><a href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-[#171717]">QR</span><span><strong className="block text-sm tracking-wide">Qatar Rental</strong><small className="text-[10px] uppercase tracking-[.18em] text-stone-400">Operations</small></span></a><button className="lg:hidden" onClick={() => setMobileNav(false)}><X size={19} /></button></div>
      <nav className="mt-12 space-y-1">{navItems.map(item => { const Icon = item.icon; return <button key={item.key} onClick={() => { setActiveTab(item.key); setMobileNav(false); }} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition ${activeTab === item.key ? 'bg-white text-[#171717]' : 'text-stone-400 hover:bg-white/10 hover:text-white'}`}><Icon size={17} />{item.label}{item.key === 'bookings' && counts.pending > 0 && <span className="ml-auto rounded-full bg-[#a88b60] px-2 py-0.5 text-[10px] text-white">{counts.pending}</span>}</button>; })}</nav>
      <div className="absolute bottom-6 left-5 right-5 border-t border-white/10 pt-5"><a href="/" className="mb-3 flex items-center gap-3 px-3 text-sm text-stone-400 hover:text-white"><ChevronRight size={16} />Return to website</a><button onClick={onSignOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-stone-400 hover:bg-white/10 hover:text-white"><LogOut size={17} />Sign out</button></div>
    </aside>
    <div className="lg:pl-72"><header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-stone-200 bg-[#f5f5f2]/95 px-5 backdrop-blur sm:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-lg border border-stone-200 bg-white p-2 lg:hidden"><Menu size={19} /></button><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#a88b60]">Internal workspace</p><h1 className="mt-1 text-xl font-semibold capitalize">{activeTab === 'fleet' ? 'Fleet inventory' : activeTab}</h1></div></div><div className="flex items-center gap-3"><button onClick={loadData} className="hidden items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-600 sm:flex"><BarChart3 size={15} />Refresh</button><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-xs font-bold text-white">AD</div></div></header>
      <main className="mx-auto max-w-[1500px] p-5 sm:p-8">{notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span>{notice}</span><button onClick={() => setNotice('')}><X size={16} /></button></div>}{loading ? <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-[#a88b60]" /></div> : <>
        {activeTab === 'overview' && <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metricCards.map(card => { const Icon = card.icon; return <div key={card.label} className="rounded-2xl border border-stone-200 bg-white p-5"><div className="flex items-center justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.tone}`}><Icon size={18} /></span><span className="text-xs text-stone-400">Live</span></div><p className="mt-6 text-3xl font-semibold">{card.value}</p><p className="mt-1 text-sm text-stone-500">{card.label}</p></div>; })}</div><div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_.8fr]"><section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Recent booking requests</h2><p className="mt-1 text-sm text-stone-500">The latest activity across your concierge desk.</p></div><button onClick={() => setActiveTab('bookings')} className="text-xs font-semibold text-[#a88b60]">View all</button></div><BookingTable bookings={bookings.slice(0, 5)} onSelect={setSelectedBooking} /></section><section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"><h2 className="font-semibold">Fleet at a glance</h2><p className="mt-1 text-sm text-stone-500">Current inventory across service modes.</p><div className="mt-6 space-y-4"><div className="flex items-center justify-between border-b border-stone-100 pb-4"><span className="flex items-center gap-3 text-sm"><Car size={17} className="text-[#a88b60]" />Total vehicles</span><strong>{vehicles.length}</strong></div><div className="flex items-center justify-between border-b border-stone-100 pb-4"><span className="flex items-center gap-3 text-sm"><Users size={17} className="text-[#a88b60]" />Chauffeur vehicles</span><strong>{vehicles.filter(v => v.service_mode === 'Chauffeur service').length}</strong></div><div className="flex items-center justify-between"><span className="flex items-center gap-3 text-sm"><Bell size={17} className="text-[#a88b60]" />Email templates</span><strong>{templates.length}</strong></div></div><button onClick={() => setActiveTab('fleet')} className="mt-7 w-full rounded-lg bg-[#171717] px-4 py-3 text-sm font-semibold text-white">Manage fleet</button></section></div></>}
        {activeTab === 'bookings' && <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><h2 className="font-semibold">Booking queue</h2><p className="mt-1 text-sm text-stone-500">Review requests, update statuses and contact customers.</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search size={16} className="absolute left-3 top-3 text-stone-400" /><input className="input h-10 min-w-64 pl-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings" /></div><select className="input h-10 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All</option><option>Pending approval</option><option>Approved</option><option>Rejected</option><option>Completed</option></select></div></div><BookingTable bookings={filteredBookings} onSelect={setSelectedBooking} /></section>}
        {activeTab === 'fleet' && <section><div className="mb-6 flex items-end justify-between"><div><h2 className="text-xl font-semibold">Fleet inventory</h2><p className="mt-1 text-sm text-stone-500">A clear view of the vehicles available across Qatar.</p></div><span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-stone-600 shadow-sm">{vehicles.length} vehicles</span></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{vehicles.map(vehicle => <article key={vehicle.id || vehicle.name} className="overflow-hidden rounded-2xl border border-stone-200 bg-white"><div className="h-40 bg-stone-100"><img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover" /></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a88b60]">{vehicle.category}</p><h3 className="mt-1 font-semibold">{vehicle.name}</h3></div><span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-semibold text-stone-500">{vehicle.service_mode === 'Chauffeur service' ? 'Chauffeur' : 'Self-drive'}</span></div><div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-xs text-stone-500"><span>{vehicle.passengers} passengers · {vehicle.luggage} luggage</span><strong className="text-stone-900">From QAR {Number(vehicle.price).toFixed(0)}</strong></div></div></article>)}</div></section>}
        {activeTab === 'emails' && <section className="grid gap-6 xl:grid-cols-[1fr_380px]"><div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"><h2 className="font-semibold">Customer email templates</h2><p className="mt-1 text-sm text-stone-500">Choose a booking and send a prepared message to the correct customer.</p><div className="mt-6 space-y-3">{templates.map(template => <div key={template.template_key} className="rounded-xl border border-stone-200 p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-semibold">{template.name}</h3><p className="mt-1 text-xs text-stone-500">{template.subject}</p></div><button disabled={!selectedBooking || Boolean(updating)} onClick={() => sendEmail(template)} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#171717] px-3 text-xs font-semibold text-white disabled:opacity-40">{updating === template.template_key ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}Send</button></div><p className="mt-4 whitespace-pre-line rounded-lg bg-stone-50 p-3 text-xs leading-5 text-stone-600">{template.body}</p></div>)}</div></div><BookingPicker bookings={bookings} selected={selectedBooking} onSelect={setSelectedBooking} /></section>}
        {activeTab === 'settings' && <section className="max-w-3xl rounded-2xl border border-stone-200 bg-white p-5 sm:p-7"><h2 className="font-semibold">Operations settings</h2><p className="mt-1 text-sm text-stone-500">Workspace preferences and service configuration.</p><div className="mt-7 divide-y divide-stone-100"><SettingRow icon={Bell} title="Booking notifications" description="Email actions are queued in the outbox for delivery." enabled /><SettingRow icon={ShieldCheck} title="Approval before payment" description="Customers are not charged while a request is pending approval." enabled /><SettingRow icon={FileText} title="Customer communication" description="Use the prepared templates in Email templates to contact customers." enabled /></div><div className="mt-7 rounded-xl bg-stone-50 p-4 text-xs leading-5 text-stone-500">Production email delivery is currently mocked. Connect the configured email provider to deliver queued messages automatically.</div></section>}
      </>}</main></div>
    {selectedBooking && <BookingDrawer booking={selectedBooking} templates={templates} updating={updating} onClose={() => setSelectedBooking(null)} onStatus={updateStatus} onEmail={sendEmail} />}
  </div>;
}

function BookingTable({ bookings, onSelect }: { bookings: Booking[]; onSelect: (booking: Booking) => void }) {
  if (!bookings.length) return <div className="mt-8 rounded-xl bg-stone-50 p-8 text-center text-sm text-stone-500">No bookings match these filters.</div>;
  return <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400"><tr><th className="pb-3 font-semibold">Booking</th><th className="pb-3 font-semibold">Journey</th><th className="pb-3 font-semibold">Date</th><th className="pb-3 font-semibold">Status</th><th className="pb-3"></th></tr></thead><tbody className="divide-y divide-stone-100">{bookings.map(booking => <tr key={booking.reference} className="group"><td className="py-4"><strong className="block text-xs">{booking.reference}</strong><span className="text-xs text-stone-500">{booking.name}</span></td><td className="max-w-[220px] py-4 text-xs text-stone-600"><span className="block truncate">{booking.pickup}</span><span className="block truncate text-stone-400">to {booking.dropoff}</span></td><td className="py-4 text-xs text-stone-600">{booking.travel_date}<br />{booking.travel_time}</td><td className="py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass(booking.status)}`}>{booking.status}</span></td><td className="py-4 text-right"><button onClick={() => onSelect(booking)} className="text-xs font-semibold text-[#a88b60] opacity-70 transition group-hover:opacity-100">Details <ChevronRight className="inline" size={14} /></button></td></tr>)}</tbody></table></div>;
}

function BookingPicker({ bookings, selected, onSelect }: { bookings: Booking[]; selected: Booking | null; onSelect: (booking: Booking | null) => void }) {
  return <div className="h-fit rounded-2xl border border-stone-200 bg-white p-5"><h2 className="font-semibold">Select a booking</h2><p className="mt-1 text-sm text-stone-500">Email actions will use this customer.</p><div className="mt-5 max-h-[500px] space-y-2 overflow-y-auto">{bookings.map(booking => <button key={booking.reference} onClick={() => onSelect(booking)} className={`w-full rounded-xl border p-3 text-left transition ${selected?.reference === booking.reference ? 'border-[#a88b60] bg-[#fbf8f2]' : 'border-stone-200 hover:border-stone-300'}`}><strong className="block text-xs">{booking.reference} · {booking.name}</strong><span className="mt-1 block truncate text-xs text-stone-500">{booking.email}</span></button>)}</div></div>;
}

function BookingDrawer({ booking, templates, updating, onClose, onStatus, onEmail }: { booking: Booking; templates: EmailTemplate[]; updating: string; onClose: () => void; onStatus: (booking: Booking, status: string) => void; onEmail: (template: EmailTemplate) => void }) {
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}><aside className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl sm:p-8" onClick={e => e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a88b60]">Booking details</p><h2 className="mt-2 text-2xl font-semibold">{booking.reference}</h2></div><button onClick={onClose} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100"><X size={19} /></button></div><div className="mt-7 rounded-xl bg-stone-50 p-4"><p className="font-semibold">{booking.name}</p><p className="mt-1 text-sm text-stone-500">{booking.email}</p><p className="text-sm text-stone-500">{booking.phone}</p></div><div className="mt-6 space-y-4 text-sm"><Detail label="Journey" value={`${booking.pickup} → ${booking.dropoff}`} /><Detail label="Date and time" value={`${booking.travel_date} at ${booking.travel_time}`} /><Detail label="Service" value={booking.service} /><Detail label="Vehicle" value={booking.vehicle} /><Detail label="Estimated total" value={`QAR ${Number(booking.total || 0).toFixed(2)}`} /><Detail label="Payment" value={booking.payment_status || 'Awaiting payment'} /></div><div className="mt-8"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">Update status</p><div className="grid grid-cols-2 gap-2">{['Approved', 'Rejected', 'Completed', 'Pending approval'].map(status => <button key={status} disabled={Boolean(updating)} onClick={() => onStatus(booking, status)} className={`rounded-lg border px-3 py-3 text-xs font-semibold transition hover:border-[#a88b60] disabled:opacity-50 ${status === booking.status ? 'border-[#a88b60] bg-[#fbf8f2]' : 'border-stone-200'}`}>{updating === booking.reference && status !== booking.status ? <Loader2 size={14} className="mx-auto animate-spin" /> : status}</button>)}</div></div><div className="mt-8 border-t border-stone-100 pt-6"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">Contact customer</p><div className="space-y-2">{templates.map(template => <button key={template.template_key} disabled={Boolean(updating)} onClick={() => onEmail(template)} className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-stone-200 px-3 text-left text-xs font-semibold hover:border-[#a88b60] disabled:opacity-50"><Mail size={15} className="text-[#a88b60]" />{template.name}</button>)}</div></div></aside></div>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-5 border-b border-stone-100 pb-3"><span className="text-stone-500">{label}</span><strong className="text-right font-medium">{value}</strong></div>; }
function SettingRow({ icon: Icon, title, description, enabled }: { icon: typeof Bell; title: string; description: string; enabled?: boolean }) { return <div className="flex items-center gap-4 py-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-[#a88b60]"><Icon size={18} /></span><div className="flex-1"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-stone-500">{description}</p></div>{enabled && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Enabled</span>}</div>; }

function AdminGuard({ children }: { children: ReactNode }) {
  const operationsPath = window.location.pathname.replace(/\/$/, '') === '/operations';
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('qatar-rental-admin') === 'true');
  useEffect(() => { if (!operationsPath) return; document.body.classList.add('qr-operations'); const style = document.createElement('style'); style.textContent = 'body.qr-operations header,body.qr-operations footer{display:none!important}'; document.head.appendChild(style); return () => { document.body.classList.remove('qr-operations'); style.remove(); }; }, [operationsPath]);
  const signOut = () => { sessionStorage.removeItem('qatar-rental-admin'); setAuthenticated(false); };
  if (operationsPath && !authenticated) return <OperationsLogin onAuthenticated={() => setAuthenticated(true)} />;
  if (operationsPath && authenticated) return <AdminDashboard onSignOut={signOut} />;
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><AdminGuard><App /></AdminGuard></ErrorBoundary></React.StrictMode>);
