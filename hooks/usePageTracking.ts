import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { dbService } from '../lib/supabase';

/**
 * Lightweight page view tracking hook.
 * Tracks page views on route changes without duplicating on re-renders.
 */
export function usePageTracking() {
    const location = useLocation();
    const lastTrackedPath = useRef<string>('');

    useEffect(() => {
        const currentPath = location.pathname;

        // Only track if path changed (prevents duplicate counts on re-renders)
        if (currentPath !== lastTrackedPath.current) {
            lastTrackedPath.current = currentPath;

            // Skip admin pages from public analytics
            if (!currentPath.startsWith('/admin')) {
                dbService.trackPageView(currentPath);
            }
        }
    }, [location.pathname]);
}
