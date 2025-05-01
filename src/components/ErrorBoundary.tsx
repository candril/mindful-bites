import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
    window.location.href = window.location.pathname;
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-xl">
            <div className="mb-6 text-center">
              <span role="img" aria-label="Error" className="text-6xl">
                🙃
              </span>
              <h1 className="text-2xl font-bold mt-4">
                Oops! Something went wrong
              </h1>
              <p className="mt-2 text-gray-600">
                We've encountered an unexpected problem. Don't worry, it happens
                to the best apps!
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={this.handleRetry}>Try Again</Button>
              <Button asChild variant="secondary">
                <a href="/">Go Home</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
