import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Resets scroll position on route changes
 * 
 * Place this component inside BrowserRouter to ensure
 * scroll position resets to top on every navigation.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position on route change
    window.scrollTo(0, 0);
    
    // Also reset any scrollable containers
    const scrollContainers = document.querySelectorAll('.screen-scrollable');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
