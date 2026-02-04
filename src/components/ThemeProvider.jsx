
import React, { useEffect } from 'react';

export const ThemeProvider = ({ children, ...props }) => {
    useEffect(() => {
        const root = window.document.documentElement;
        
        // Always apply dark theme
        root.classList.remove('light');
        root.classList.add('dark');
    }, []);

    return <>{children}</>;
};
