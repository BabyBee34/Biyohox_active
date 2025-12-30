import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Production'da hata loglama servisi kullanılabilir
        if (import.meta.env.DEV) {
            console.error('Uncaught error:', error, errorInfo);
        }
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">
                            Bir Hata Oluştu
                        </h1>

                        <p className="text-slate-500 mb-6">
                            Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya anasayfaya dönün.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-6 p-4 bg-slate-100 rounded-lg text-left overflow-auto">
                                <p className="text-xs font-mono text-red-600 break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                            >
                                <RefreshCw size={18} />
                                Sayfayı Yenile
                            </button>

                            <Link
                                to="/"
                                onClick={() => this.setState({ hasError: false, error: null })}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                <Home size={18} />
                                Anasayfa
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
