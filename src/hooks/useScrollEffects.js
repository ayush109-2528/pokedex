import { useState, useEffect, useCallback } from 'react';

export const useScrollEffects = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToTypeDetails = useCallback(() => {
    document.getElementById('type-detail-panel')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    showScrollToTop,
    scrollToTop,
    scrollToTypeDetails
  };
};
