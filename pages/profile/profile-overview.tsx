import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import stateService from "../../services/state-service";
//import StravaConfigDTO from '../../dtos/strava-config-dto';
//import { authorize } from 'react-native-app-auth';

// const stravaAuthConfig: StravaConfigDTO = {
//   clientId: 'YOUR_STRAVA_CLIENT_ID',
//   clientSecret: 'YOUR_STRAVA_CLIENT_SECRET',
//   redirectUrl: 'YOUR_APP_REDIRECT_URL',
//   scopes: ['read_all', 'activity:read_all'],
//   serviceConfiguration: {
//     authorizationEndpoint: 'https://www.strava.com/oauth/authorize',
//     tokenEndpoint: 'https://www.strava.com/oauth/token',
//     revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
//   },
// };

//const stravaAuthUrl = 'https://www.strava.com/oauth/mobile/authorize?client_id=157862&client_secret=b2f479f3766b5ef263a71681bdab0260a3ce4fe1&code=78e8307ab7845284fe1977f3b8adc8bbb6b01783&grant_type=78e8307ab7845284fe1977f3b8a';
const client_id = "157863";
const client_secret = "33a954d453c0230974494437e9e779cec3698cf7";
const redirect_uri = "https://com.roadrunnerapp"; //'https://www.intric.co.za';
const scope = "activity:read_all";
const response_type = "code";
//https://www.intric.co.za/?code=3295f3f4c24ad7e71660168a9fcb01ecb5b580ad&scope=activity%3Aread_all%2Cread
const stravaAuthUrl = `https://www.strava.com/oauth/mobile/authorize?client_id=${client_id}&client_secret=${client_secret}&scope=${scope}&response_type=${response_type}&redirect_uri=${redirect_uri}`;

export default function ProfilePage() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const settingsIconRef = useRef<View>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const firstname: string = stateService.auth?.Name || "";
  const surname: string = stateService.auth?.Surname || "";
  const username: string = stateService.auth?.Username || "";

  const handleSettingsPress = () => {
    if (settingsIconRef.current) {
      settingsIconRef.current.measure((fx, fy, w, h, px, py) => {
        setMenuPosition({ x: px - 110, y: py }); // Adjust these values as needed
        setIsMenuVisible(!isMenuVisible);
      });
    } else {
      setIsMenuVisible(!isMenuVisible); // Fallback if ref is not available immediately
    }
  };

  const handleConnectStrava = async () => {
    setIsMenuVisible(false); // Close the menu before starting auth
    try {
      console.log("Initiating Strava authorization...");
      Linking.openURL(stravaAuthUrl)
        .catch((err) => console.error("An error occurred: ", err))
        .then((res) => {
          console.log("Strava authorization response:", res);
        });
      //await StravaService.GetAccessToken();
      // const result = await authorize(stravaAuthConfig);
      // if (result && result.authorizationCode) {
      //   console.log('Authorization code received:', result.authorizationCode);
      // } else {
      //   console.log('Strava authorization failed or was cancelled.');
      // }
    } catch (err: any) {
      console.log("Strava authorization error:", err);
      if (err.message) {
        console.log("Error", err.message);
      }
      Alert.alert("Error", "Could not connect to Strava.");
    }
  };

  const handleLogoutPress = () => {
    stateService.clearAuth();
    setIsMenuVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
            }}
          >
            <View style={styles.menu}>
              <Pressable
                onPress={async () => {
                  await handleConnectStrava();
                  setIsMenuVisible(false);
                }}
              >
                <Text style={styles.menuItem}>Strava</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsMenuVisible(false);
                  handleLogoutPress();
                }}
              >
                <Text style={styles.menuItem}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        {/* Settings Icon */}
        <TouchableOpacity
          ref={settingsIconRef}
          style={styles.settingsIcon}
          onPress={() => handleSettingsPress()}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: "https://picsum.photos/seed/picsum/200/300" }}
          />
        </View>
        <Text style={styles.headerText}>
          {firstname} {surname}
        </Text>
        <Text style={styles.subHeaderText}>@{username} </Text>
        <Text style={styles.subHeaderText}>On IOU-Wallet since 2024 </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.friendTagCardContainer}>
          <View style={styles.friendTagCard}>
            <TouchableOpacity
              onPress={() => console.log("Friends Pressed")}
              style={styles.friendTagButton}
            >
              <Text style={styles.friendTagText}>5 </Text>
              <Text style={styles.friendTagText}>Friends </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.friendTagCard}>
            <TouchableOpacity
              onPress={() => console.log("Leagues Pressed")}
              style={styles.friendTagButton}
            >
              <Text style={styles.friendTagText}>1 </Text>
              <Text style={styles.friendTagText}>Leagues </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => console.log("Add friends Pressed")}
            style={styles.addFriendButton}
          >
            <Ionicons name="person-add-outline" size={24} color="#fff" />
            <Text style={styles.friendTagText}>Add Friends </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pageSection}>
          <Text style={styles.pageSectionText}>Stats </Text>
        </View>

        <View style={styles.pageSection}>
          <Text style={styles.pageSectionText}>Trophies </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A4D68",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#088395",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative", // Ensures the settings icon can be positioned absolutely
  },
  settingsIcon: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subHeaderText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  friendTagCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 20,
  },
  friendTagCard: {
    borderRadius: 10,
    borderRightColor: "#fff",
    borderRightWidth: 1,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
  },
  friendTagText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  friendTagButton: {
    alignItems: "center",
  },
  addFriendButton: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  card: {
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#fff",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
  },
  pageSection: {
    marginBottom: 20,
  },
  pageSectionText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  menu: {
    backgroundColor: "#0A4D68",
    borderRadius: 10,
    padding: 10,
    width: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 5,
  },
  menuItem: {
    padding: 10,
    fontSize: 16,
    color: "#fff",
  },
});
