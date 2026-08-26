import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import LoanDTO from "../../dtos/loan-dto";
import LoanService from "../../services/loan-service";
import stateService from "../../services/state-service";

export default function HomePage() {
  const username: string = stateService.auth?.username || "";
  const currentUserId = stateService.auth?.id || "";

  const [owedToUserTotal, setOwedToUserTotal] = useState<number>(0);
  const [userOwesTotal, setUserOwesTotal] = useState<number>(0);
  const [givenLoansCount, setGivenLoansCount] = useState<number>(0);
  const [borrowedLoansCount, setBorrowedLoansCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUserId) {
      loadDashboardData();
    }
  }, [currentUserId]);

  const loadDashboardData = async () => {
    if (!currentUserId) return;
    setIsLoading(true);

    try {
      const [givenRes, borrowedRes] = await Promise.all([
        LoanService.GetAllByUserIdAsync(currentUserId),
        LoanService.GetAllByBenUserIdAsync(currentUserId),
      ]);

      if (givenRes.statusCode === 200 && Array.isArray(givenRes.data)) {
        const loansGiven: LoanDTO[] = givenRes.data;
        const totalGiven = loansGiven.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        setOwedToUserTotal(totalGiven);
        setGivenLoansCount(loansGiven.length);
      } else {
        setOwedToUserTotal(0);
        setGivenLoansCount(0);
      }

      if (borrowedRes.statusCode === 200 && Array.isArray(borrowedRes.data)) {
        const loansBorrowed: LoanDTO[] = borrowedRes.data;
        const totalBorrowed = loansBorrowed.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        setUserOwesTotal(totalBorrowed);
        setBorrowedLoansCount(loansBorrowed.length);
      } else {
        setUserOwesTotal(0);
        setBorrowedLoansCount(0);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <View style={styles.iconContainer}>
            <Ionicons name="flame" size={24} color="#EF4924" />
            <Text style={styles.iconText}>{givenLoansCount} Given</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet" size={24} color="#F6A537" />
            <Text style={styles.iconText}>{borrowedLoansCount} Owed</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadDashboardData} tintColor="#00FFCA" />
        }
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Hello, {username}</Text>
            <Text style={styles.cardText}>
              {"See what's happening in your wallet!"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Total amount owed to you</Text>
            {isLoading ? (
              <ActivityIndicator size="small" color="#088395" />
            ) : (
              <Text style={styles.cardHighlightText}>R {owedToUserTotal}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Total amount you owe to others</Text>
            {isLoading ? (
              <ActivityIndicator size="small" color="#088395" />
            ) : (
              <Text style={styles.cardHighlightText}>R {userOwesTotal}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Active Loans Summary</Text>
            <Text style={styles.cardText}>
              Given: {givenLoansCount} loan(s) | Borrowed: {borrowedLoansCount} loan(s)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A4D68",
  },
  scrollContainer: {
    flex: 1,
    flexGrow: 1,
    paddingTop: 20,
  },
  header: {
    padding: 10,
    paddingTop: 40,
    backgroundColor: "#088395",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  headerText: {
    fontSize: 32,
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
    width: "100%",
    marginTop: 60,
    flexGrow: 1,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#ccd6db",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
  },
  cardHighlightText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#088395",
    marginTop: 5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    margin: "auto",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
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
