import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import StandardNavBar from '../components/StandardNavBar.jsx';

const ProtectedLayout = () => {
  const [refreshStatsFlag, setRefreshStatsFlag] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true = authenticated, false = not authenticated
  const navigate = useNavigate();
  const hasShownToastRef = useRef(false);

  const handleRefreshStats = () => {
    setRefreshStatsFlag(prev => prev + 1);
  };

  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData');
      
      if (!userData) {
        setIsAuthenticated(false);
        if (!hasShownToastRef.current) {
          toast.error('You must be logged in');
          hasShownToastRef.current = true;
        }
        navigate('/');
        return;
      }

      const parsedData = JSON.parse(userData);
      if (parsedData.message !== 'Login successful') {
        setIsAuthenticated(false);
        if (!hasShownToastRef.current) {
          toast.error('You must be logged in');
          hasShownToastRef.current = true;
        }
        navigate('/');
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error parsing userData:', error);
      setIsAuthenticated(false);
      if (!hasShownToastRef.current) {
        toast.error('You must be logged in');
        hasShownToastRef.current = true;
      }
      navigate('/');
    }
  }, [navigate]);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }

  // If not authenticated, don't render the content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <StandardNavBar 
        refreshTrigger={refreshStatsFlag}
      />
      <Outlet context={{ onVehicleAdded: handleRefreshStats, onUserAdded: handleRefreshStats }} />
    </>
  );
};

export default ProtectedLayout;
