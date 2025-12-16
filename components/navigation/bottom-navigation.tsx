import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BottomNavigationProps = {
  currentRoute: string;
  onNavigate: (route: string) => void;
};

export default function BottomNavigation({ currentRoute, onNavigate }: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onNavigate('home')}
      >
        <Ionicons 
          name="home-sharp"
          size={24} 
          color={currentRoute === 'home' ? '#00FFCA' : '#ffffff'} 
        />
        <Text style={[
          styles.tabText,
          { color: currentRoute === 'home' ? '#00FFCA' : '#ffffff' }
        ]}>Home </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onNavigate('league')}
      >
        <Ionicons 
          name="trophy-sharp"
          size={24} 
          color={currentRoute === 'league' ? '#00FFCA' : '#ffffff'} 
        />
        <Text style={[
          styles.tabText,
          { color: currentRoute === 'league' ? '#00FFCA' : '#ffffff' }
        ]}>League </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onNavigate('friend')}
      >
        <Ionicons 
          name="people"
          size={24} 
          color={currentRoute === 'friend' ? '#00FFCA' : '#ffffff'} 
        />
        <Text style={[
          styles.tabText,
          { color: currentRoute === 'friend' ? '#00FFCA' : '#ffffff' }
        ]}>Friends </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onNavigate('profile')}
      >
        <Ionicons 
          name="person" 
          size={24} 
          color={currentRoute === 'profile' ? '#00FFCA' : '#ffffff'} 
        />
        <Text style={[
          styles.tabText,
          { color: currentRoute === 'profile' ? '#00FFCA' : '#ffffff' }
        ]}>Profile </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#0A4D68',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
}); 