import React from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree and
 * displays a fallback UI instead of crashing the whole app.
 *
 * Usage:
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    if (import.meta.env.DEV) {
      console.error("Error Boundary caught an error:", error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-slate-800">
                Something Went Wrong
              </h1>
              <p className="text-slate-600">
                We're sorry, but something unexpected happened. Please try
                refreshing the page or return to the home page.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-slate-100 rounded-lg p-4 space-y-2">
                <p className="text-xs font-mono text-red-600 font-semibold">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs font-mono text-slate-700">
                    <summary className="cursor-pointer hover:text-slate-900 font-semibold">
                      Stack trace
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap text-[10px] bg-white p-2 rounded border border-slate-200 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg hover:shadow-xl">
                <RefreshCw size={18} />
                Try Again
              </button>

              <a
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold border-2 border-slate-200">
                <Home size={18} />
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
