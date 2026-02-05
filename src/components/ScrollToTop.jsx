import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top immediately on route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Use 'instant' for immediate scroll without animation
        });

        // Fallback for older browsers and ensure scroll on mobile
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Additional fallback with slight delay for mobile browsers
        // that might need time to render new content
        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
