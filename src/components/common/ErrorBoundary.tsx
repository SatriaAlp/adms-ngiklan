import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full border border-red-200">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Aplikasi Mengalami Crash</h1>
            <p className="text-gray-700 mb-4">Terdapat kesalahan kode saat me-render komponen ini.</p>
            
            <div className="bg-red-100 p-4 rounded-lg overflow-auto mb-4">
              <h2 className="font-bold text-red-800">Error Message:</h2>
              <code className="text-sm text-red-900 break-all">{this.state.error?.toString()}</code>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              <h2 className="font-bold text-gray-800 mb-2">Component Stack:</h2>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
