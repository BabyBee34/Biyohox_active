import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        checkAuth();

        // Auth state değişikliklerini dinle
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    // Yükleniyor durumu
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-bio-mint" />
            </div>
        );
    }

    // Oturum yoksa login sayfasına yönlendir
    if (!isAuthenticated) {
        return <Navigate to="/admin" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
