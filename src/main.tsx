import React, { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Loader2, LockKeyhole, LogOut, ShieldCheck } from 'lucide-react';
import App from './App';
import { db } from './lib/db';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Qatar Rental application error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#f5f5f2] px-5 py-12 text-[#151515]">
          <section className="w-full max-w-lg rounded-2xl border border-[#e4e3df] bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-sm font-bold text-white">
              QR
            </div>
            <p className="mt-7 text-xs font-semibold uppercase tracking-[.18em] text-[#a88b60]">
              Qatar Rental
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold">
              We are refreshing the experience.
            </h1>
            <p className="mt-4 text-sm leading-6 text-stone-500">
              Something prevented the page from loading correctly. Please reload the page to try again.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-7 min-h-12 rounded-lg bg-[#151515] px-6 py-3 text-sm font-semibold text-white"
            >
              Reload page
            </button>
            {this.state.error?.message && (
              <p className="mt-6 break-words text-left text-xs leading-5 text-stone-400">
                Error: {this.state.error.message}
              </p>
            )}
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

function AdminGuard({ children }: { children: ReactNode }) {
  const [operationsVisible, setOperationsVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('qatar-rental-admin') === 'true');
  const [email, setEmail] = useState('admin@qatar-car-rental.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkOperationsPage = () => {
      const text = document.body.innerText;
      setOperationsVisible(text.includes('Operations dashboard') && text.includes('Internal workspace'));
    };

    checkOperationsPage();
    const observer = new MutationObserver(checkOperationsPage);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const rows = await db.select<{ id: number; email: string }>(
        'admin_users',
        `?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&password=eq.${encodeURIComponent(password)}&active=eq.true&limit=1`
      );

      if (!rows.length) {
        setError('The email or password is incorrect.');
        return;
      }

      sessionStorage.setItem('qatar-rental-admin', 'true');
      setAuthenticated(true);
      setPassword('');
    } catch {
      setError('We could not verify your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    sessionStorage.removeItem('qatar-rental-admin');
    setAuthenticated(false);
  };

  return (
    <>
      {children}
      {operationsVisible && authenticated && (
        <button
          type="button"
          onClick={signOut}
          className="fixed bottom-5 right-5 z-[90] inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-[#151515] px-4 py-3 text-xs font-semibold text-white shadow-xl"
        >
          <LogOut size={15} />
          Sign out
        </button>
      )}
      {operationsVisible && !authenticated && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#151515]/75 px-5 py-8 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-2xl border border-[#e4e3df] bg-white p-7 shadow-2xl sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#151515] text-white">
              <ShieldCheck size={22} />
            </div>
            <p className="mt-7 text-xs font-semibold uppercase tracking-[.18em] text-[#a88b60]">Restricted access</p>
            <h1 className="mt-3 font-display text-3xl font-semibold">Operations dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              Sign in with your administrator account to manage booking requests and operations.
            </p>
            <form onSubmit={signIn} className="mt-7 space-y-5">
              <div>
                <label className="label" htmlFor="admin-email">Email address</label>
                <input
                  id="admin-email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="admin-password">Password</label>
                <div className="relative">
                  <LockKeyhole size={16} className="absolute left-3 top-4 text-stone-400" />
                  <input
                    id="admin-password"
                    className="input pl-10"
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading && <Loader2 size={17} className="animate-spin" />}
                {loading ? 'Verifying account...' : 'Sign in to operations'}
              </button>
            </form>
            <div className="mt-6 rounded-xl bg-mist p-4 text-xs leading-5 text-stone-500">
              Administrator access is required for booking and fleet operations.
            </div>
          </section>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AdminGuard>
        <App />
      </AdminGuard>
    </ErrorBoundary>
  </React.StrictMode>
);
