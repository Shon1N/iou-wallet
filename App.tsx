import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import HomePage from './pages/home/home-overview';
import ProfilePage from './pages/profile/profile-overview';
import FriendOverview from './pages/friends/friend-overview';
import LeagueOverview from './pages/league/league-overview';
import BottomNavigation from './components/navigation/bottom-navigation';
import LoginScreen from './pages/auth/login';
import stateService from './services/state-service';
import AuthDTO from './dtos/auth-dto';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  // useEffect(() => {
  //   setIsAuthenticated(stateService.auth !== null);
  // }, [stateService.auth]);

  useEffect(() => {
    const unsubscribe = stateService.subscribeAuth((authStatus: boolean) => {
      setIsAuthenticated(authStatus);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // Check authentication status after app is ready
    if (isAppReady && !isAuthenticated) {
      // You might want to navigate to the LoginScreen here
      setCurrentRoute('login'); // If you handle routes in renderPage
      // Or, if you have a separate navigation setup, navigate there.
    } else if (isAppReady) {
      setCurrentRoute('home'); // Ensure it's 'home' if authenticated
    }
  }, [isAuthenticated, isAppReady]);

  useEffect(() => {
    // Simulate app ready after initial checks (e.g., loading stored token)
    setTimeout(() => {
      setIsAppReady(true);
    }, 500); // Adjust the delay as needed
  }, []);

  const handleLogin = () => {
    if(stateService.auth !== null && stateService.auth?.Token?.length > 0){
      setIsAuthenticated(true);
    }
    else {
      setIsAuthenticated(false);
    }
  };


  const renderPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'league':
          return <LeagueOverview />;
      case 'friend':
          return <FriendOverview />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <>
          {renderPage()}
          <BottomNavigation 
            currentRoute={currentRoute}
            onNavigate={setCurrentRoute}
          />
        </>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
