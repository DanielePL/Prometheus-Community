// client/src/components/common/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 m-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <h2 className="text-xl font-bold text-red-400">Something went wrong</h2>
          </div>
          
          <p className="text-gray-300 mb-4">
            This component encountered an error and couldn't render properly.
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="bg-gray-800 rounded-lg p-4 mb-4">
              <summary className="text-gray-400 cursor-pointer hover:text-white">
                Error Details (Development)
              </summary>
              <div className="mt-3 space-y-2">
                <div className="text-red-400 font-mono text-sm">
                  {this.state.error.toString()}
                </div>
                <div className="text-gray-400 font-mono text-xs whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </div>
              </div>
            </details>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
