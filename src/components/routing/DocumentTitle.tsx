import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Route to title mapping
const routeTitles: Record<string, string> = {
  '/': 'Welcome | Stack',
  '/login': 'Login | Stack',
  '/consumer': 'Home | Stack',
  '/vendor': 'Dashboard | Stack',
  '/vendor/schedule': 'Schedule | Stack',
  '/vendor/profile-preview': 'Profile Preview | Stack',
  '/profile': 'Profile | Stack',
  '/rewards': 'Rewards | Stack',
  '/notifications': 'Notifications | Stack',
  '/messages': 'Messages | Stack',
  '/chat': 'Chat | Stack',
  '/jobs': 'Jobs | Stack',
  '/job': 'Job Details | Stack',
  '/post-request': 'Post Request | Stack',
  '/job-configuration': 'Job Setup | Stack',
  '/quote-management': 'Manage Quotes | Stack',
  '/review': 'Leave Review | Stack',
  '/payment': 'Payment | Stack',
  '/request': 'Request Details | Stack',
  '/services': 'Services | Stack',
  '/market-benchmark': 'Market Insights | Stack',
  '/company-profile': 'Company Profile | Stack',
  '/help': 'Help Center | Stack',
  '/transactions': 'Transactions | Stack',
  '/vendor-work': 'Active Work | Stack',
};

/**
 * DocumentTitle - Updates document.title based on current route
 */
const DocumentTitle: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    // Direct match first
    if (routeTitles[path]) {
      document.title = routeTitles[path];
      return;
    }
    
    // Check for parameterized routes
    for (const [route, title] of Object.entries(routeTitles)) {
      if (path.startsWith(route) && route !== '/') {
        document.title = title;
        return;
      }
    }
    
    // Default title
    document.title = 'Stack';
  }, [location.pathname]);

  return null;
};

export default DocumentTitle;
