import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from 'react-native';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import PaceCalculator from '../../components/pace-calculator/pace-calculator';
import { WEATHER_API_KEY } from '../../config/secrets';
import { WeatherMessages } from '../../messages/weather'; // Import the messages
import EnvelopeDTO from '../../dtos/envelope-dto'; 
import WeatherData from '../../dtos/weather-data-dto';
import LocationData from '../../dtos/location-data';
import WeatherService from '../../services/weather-service';
import stateService from '../../services/state-service';

// interface LocationData {
//   coords: {
//     latitude: number;
//     longitude: number;
//   };
// }

// interface Weather {
//   main: string;
//   description: string;
//   icon: string;
// }

// interface WeatherData {
//   name: string;
//   main: {
//     temp: number;
//     humidity: number;
//   };
//   wind: {
//     speed: number;
//   };
//   weather: Weather[];
// }

export default function HomePage() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const username: string = stateService.auth?.Username || '';

  const getGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      Coords: {
        Latitude: currentLocation.coords.latitude,
        Longitude: currentLocation.coords.longitude,
      },
    });
  }

  const handleSyncRuns = () => {
    // Logic to sync runs from Strava
    console.log('Syncing runs from Strava...');
  };

  const fetchWeather = async () => {
    try {
      if (location) {
          const response = await WeatherService.GetByLocationAsync(location);
          
          if (!response.Status || response.Status !== 200) {
            console.log("bad res",  response);
            setErrorMsg('Error fetching weather data');
            return;
          }

          const data = response.Data as WeatherData;
          setWeatherData(data);
      }
    } catch (err) {
      setErrorMsg('Error fetching weather data');
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      await getGetLocation();
    })();
  }, []);
  
  useEffect(() => {
    if (location) {
      (async () => {
        await fetchWeather();
      })();
    }
  }, [location]);

  let weatherDisplay: JSX.Element | string = <Text style={styles.cardText}>Fetching weather...</Text>;

  if (errorMsg) {
    weatherDisplay = <Text style={styles.cardText}>Error: {errorMsg}</Text>;
  } else if (weatherData) {
    const temperature: number = Math.round(weatherData.main.temp);
    const conditions: string = weatherData.weather[0].main;
    const cityName: string = weatherData.name;

    // Choose the appropriate message based on the conditions
    const message = WeatherMessages[conditions]
      ? WeatherMessages[conditions]
      : WeatherMessages.default
          .replace('[City]', cityName)
          .replace('[Conditions]', conditions);

    weatherDisplay = (
      <>
        <Text style={styles.cardText}>{message}</Text>
        <Text style={styles.cardText}>Temperature: {temperature}°C</Text>
        <Text style={styles.cardText}>Conditions: {conditions}</Text>
        <Text style={styles.cardText}>Wind: {weatherData.wind.speed} m/s</Text>
        <Text style={styles.cardText}>Humidity: {weatherData.main.humidity}%</Text>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <View style={styles.iconContainer}>
            <Ionicons name="flame" size={24} color="orange" />
            <Text style={styles.iconText}>5 </Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="rocket" size={24}  color="#05BFDB" />
            <Text style={styles.iconText}>1100 </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Hello, {username}</Text>
            {weatherDisplay}
          </TouchableOpacity>

          <View style={styles.card}>
            <PaceCalculator />
          </View>

          {/* Sync Runs Button */}
          <TouchableOpacity style={styles.card}>
            <TouchableOpacity style={styles.button} onPress={handleSyncRuns}>
              <Text style={styles.buttonText}>Sync Runs</Text>
            </TouchableOpacity>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A4D68',
  },
  scrollContainer: {
    flex: 1,
    flexGrow: 1,
    paddingTop: 20,
  },
  header: {
    padding: 10,
    paddingTop: 40,
    backgroundColor: '#088395',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  content: {
    padding: 20,
    width: '100%',
    marginTop: 60,
    flexGrow: 1,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#ccd6db',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 'auto'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#088395',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});