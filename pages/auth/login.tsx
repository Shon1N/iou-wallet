import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AuthDTO from "../../dtos/auth-dto";
import LoginDTO from "../../dtos/login-dto";
import AuthService from "../../services/auth-service";
import stateService from "../../services/state-service";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [loginData, setLoginData] = useState<LoginDTO>({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordSecure(!isPasswordSecure);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const { username, password } = loginData;

    if (!username || !password) {
      setIsLoading(false);
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    const envelope = await AuthService.LoginAsync(loginData);

    if (envelope.statusCode === 500) {
      setIsLoading(false);
      Alert.alert("Error", "Network error.");
      return;
    }

    if (envelope.statusCode !== 200) {
      setIsLoading(false);
      Alert.alert("Error", "Login failed. Please check your credentials.");
      return;
    }

    setIsLoading(false);
    stateService.setAuth(envelope.data as AuthDTO);
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
        placeholder="Username*"
        value={loginData.username}
        onChangeText={(value) => handleInputChange("username", value)}
        keyboardType="default"
        autoCapitalize="none"
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password*"
          value={loginData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry={isPasswordSecure}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.toggleButton}
        >
          {isPasswordSecure ? (
            <Ionicons name="eye" size={24} color="#000" />
          ) : (
            <Ionicons name="eye-off" size={24} color="#000" />
          )}
        </TouchableOpacity>
      </View>

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
    width: "100%",
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
  passwordInputContainer: {
    flexDirection: "row",
  },
  toggleButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 12,
    right: 10,
  },
});
