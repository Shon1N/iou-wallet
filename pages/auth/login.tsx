import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import LoginDTO from "../../../web-api/server/dtos/login-dto";
import AuthDTO from "../../dtos/auth-dto";
import AuthService from "../../services/auth-service";
import stateService from "../../services/state-service";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [loginData, setLoginData] = useState<LoginDTO>({
    Email: "",
    Password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const { Email, Password } = loginData;

    if (!Email || !Password) {
      setIsLoading(false);
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    const envelope = await AuthService.LoginAsync(loginData);

    if (envelope.Status === 500) {
      setIsLoading(false);
      Alert.alert("Error", "Network error.");
      return;
    }

    if (envelope.Status !== 200) {
      setIsLoading(false);
      Alert.alert("Error", "Login failed. Please check your credentials.");
      return;
    }

    setIsLoading(false);
    stateService.setAuth(envelope.Data as AuthDTO);
    onLogin();
  };

  const handleInputChange = (field: keyof LoginDTO, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email*"
        value={loginData.Email}
        onChangeText={(value) => handleInputChange("Email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password*"
        value={loginData.Password}
        onChangeText={(value) => handleInputChange("Password", value)}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {" "}
          {isLoading ? "Logging in..." : "LOGIN"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0A4D68",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#f0f0f0",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  button: {
    backgroundColor: "#088395",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
