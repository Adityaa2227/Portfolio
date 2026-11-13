import React from 'react';
import { reportError } from '../../lib/errorReporting';

/** Catches render crashes: reports them and shows a friendly fallback instead of a blank page. */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false };
  }

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  componentDidCatch(error, info) {
    reportError(error, { stack: `${error?.stack || ''}\n${info?.componentStack || ''}` });
  }

  render() {
    if (!this.state.crashed) return this.props.children;
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center text-foreground">
        <h1 className="font-heading text-3xl font-bold">Something went wrong</h1>
        <p className="max-w-[44ch] text-text-muted">This page hit an unexpected error. It has been reported. Reloading usually fixes it.</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => window.location.reload()} className="btn-primary">Reload page</button>
          <a href="/" className="btn-outline">Go home</a>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
