import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
