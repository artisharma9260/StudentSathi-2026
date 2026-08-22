import { Component } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
          <p className="text-sm text-slate-500 max-w-md">
            This part of StudentSathi hit an unexpected error. Try reloading — if it
            keeps happening, please let us know what you were doing.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md hover:shadow-lg transition"
          >
            <RefreshCcw className="w-4 h-4" /> Back to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
