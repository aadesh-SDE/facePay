import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  featureName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.featureName ? `:${this.props.featureName}` : ""}]`,
      error,
      info.componentStack,
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-16 h-16 bg-error-container/30 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-error">
              error
            </span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-on-surface-variant mb-6 max-w-xs">
            {this.props.featureName
              ? `The ${this.props.featureName} feature encountered an error.`
              : "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm active:scale-95 transition-transform"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
