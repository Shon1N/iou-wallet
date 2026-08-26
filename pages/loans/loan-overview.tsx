import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import UserSelect from "../../components/user-select";
import LoanDTO from "../../dtos/loan-dto";
import RepaymentDTO from "../../dtos/repayment-dto";
import UserDTO from "../../dtos/user-dto";
import LoanService from "../../services/loan-service";
import RepaymentService from "../../services/repayment-service";
import stateService from "../../services/state-service";

export default function LoanOverview() {
  const [activeTab, setActiveTab] = useState<"given" | "borrowed">("given");
  const [loans, setLoans] = useState<LoanDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create Loan Modal State
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [interestInput, setInterestInput] = useState("0");
  const [termInput, setTermInput] = useState("12");
  const [loanStatusIdInput] = useState("00000000-0000-0000-0000-000000000001");
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);

  // Loan Details & Repayments Modal State
  const [selectedLoan, setSelectedLoan] = useState<LoanDTO | null>(null);
  const [repayments, setRepayments] = useState<RepaymentDTO[]>([]);
  const [isLoadingRepayments, setIsLoadingRepayments] = useState(false);
  const [repaymentModalVisible, setRepaymentModalVisible] = useState(false);
  const [repaymentAmountInput, setRepaymentAmountInput] = useState("");
  const [isSubmittingRepayment, setIsSubmittingRepayment] = useState(false);

  const currentUserId = stateService.auth?.id || "";

  useEffect(() => {
    if (currentUserId) {
      loadLoans();
    }
  }, [currentUserId, activeTab]);

  const loadLoans = async () => {
    if (!currentUserId) return;
    setIsLoading(true);
    let envelope;
    if (activeTab === "given") {
      envelope = await LoanService.GetAllByUserIdAsync(currentUserId);
    } else {
      envelope = await LoanService.GetAllByBenUserIdAsync(currentUserId);
    }
    setIsLoading(false);

    if (envelope.statusCode === 200 && Array.isArray(envelope.data)) {
      setLoans(envelope.data);
    } else {
      setLoans([]);
    }
  };

  const handleCreateLoan = async () => {
    if (!selectedUser || !amountInput.trim()) {
      Alert.alert("Error", "Please select a recipient user and enter an amount.");
      return;
    }

    const amount = Number.parseFloat(amountInput);
    if (Number.isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    setIsSubmittingLoan(true);
    const newLoan: LoanDTO = {
      userId: currentUserId,
      benUserId: selectedUser.id,
      amount: amount,
      interest: Number.parseFloat(interestInput) || 0,
      term: Number.parseInt(termInput, 10) || 12,
      startDate: new Date().toISOString(),
      loanStatusId: loanStatusIdInput.trim(),
    };

    const envelope = await LoanService.CreateAsync(newLoan);
    setIsSubmittingLoan(false);

    if (envelope.statusCode === 200 || envelope.statusCode === 201) {
      Alert.alert("Success", "Loan created successfully.");
      setCreateModalVisible(false);
      setSelectedUser(null);
      setAmountInput("");
      loadLoans();
    } else {
      Alert.alert("Error", envelope.message || "Failed to create loan.");
    }
  };

  const handleOpenLoanDetails = async (loan: LoanDTO) => {
    setSelectedLoan(loan);
    if (!loan.id) return;
    setIsLoadingRepayments(true);
    const envelope = await RepaymentService.GetAllByLoanIdAsync(loan.id);
    setIsLoadingRepayments(false);
    if (envelope.statusCode === 200 && Array.isArray(envelope.data)) {
      setRepayments(envelope.data);
    } else {
      setRepayments([]);
    }
  };

  const handleAddRepayment = async () => {
    if (!selectedLoan?.id || !repaymentAmountInput.trim()) {
      Alert.alert("Error", "Please enter a valid repayment amount.");
      return;
    }

    const amount = Number.parseFloat(repaymentAmountInput);
    if (Number.isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Invalid amount.");
      return;
    }

    setIsSubmittingRepayment(true);
    const newRepayment: RepaymentDTO = {
      loanId: selectedLoan.id,
      amount: amount,
    };

    const envelope = await RepaymentService.CreateAsync(newRepayment);
    setIsSubmittingRepayment(false);

    if (envelope.statusCode === 200 || envelope.statusCode === 201) {
      Alert.alert("Success", "Repayment recorded.");
      setRepaymentModalVisible(false);
      setRepaymentAmountInput("");
      handleOpenLoanDetails(selectedLoan);
    } else {
      Alert.alert("Error", envelope.message || "Failed to add repayment.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loans</Text>
        <Text style={styles.headerSubtitle}>Manage your issued and borrowed loans</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "given" && styles.activeTabButton]}
          onPress={() => setActiveTab("given")}
        >
          <Text style={[styles.tabText, activeTab === "given" && styles.activeTabText]}>
            Loans Given
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "borrowed" && styles.activeTabButton]}
          onPress={() => setActiveTab("borrowed")}
        >
          <Text style={[styles.tabText, activeTab === "borrowed" && styles.activeTabText]}>
            Loans Owed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => setCreateModalVisible(true)}
          style={styles.addLoanButton}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>New Loan</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={loadLoans} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Loan List */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00FFCA" />
        </View>
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color="#088395" />
              <Text style={styles.emptyText}>No loans found for this category.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleOpenLoanDetails(item)}
            >
              <View style={styles.cardInfo}>
                <Ionicons name="cash-outline" size={32} color="#00FFCA" />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardAmount}>R {item.amount}</Text>
                  <Text style={styles.cardSubText}>
                    {activeTab === "given"
                      ? `Borrower ID: ${item.benUserId}`
                      : `Lender ID: ${item.userId}`}
                  </Text>
                  <Text style={styles.cardDetailText}>
                    Interest: {item.interest}% | Term: {item.term} mos
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#00FFCA" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Create Loan Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Loan</Text>

            <UserSelect
              label="Select Recipient / Borrower User*"
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              placeholder="Search username to select user..."
            />

            <Text style={styles.label}>Amount (ZAR)*</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1000"
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Interest Rate (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5"
              value={interestInput}
              onChangeText={setInterestInput}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Term (Months)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 12"
              value={termInput}
              onChangeText={setTermInput}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setCreateModalVisible(false);
                  setSelectedUser(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateLoan}
                disabled={isSubmittingLoan}
              >
                <Text style={styles.modalButtonText}>
                  {isSubmittingLoan ? "Saving..." : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loan Details & Repayments Modal */}
      <Modal visible={selectedLoan !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: "80%" }]}>
            {selectedLoan && (
              <>
                <Text style={styles.modalTitle}>Loan Details</Text>
                <Text style={styles.detailText}>Amount: R {selectedLoan.amount}</Text>
                <Text style={styles.detailText}>Interest: {selectedLoan.interest}%</Text>
                <Text style={styles.detailText}>Term: {selectedLoan.term} months</Text>

                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Repayments History</Text>

                {isLoadingRepayments ? (
                  <ActivityIndicator size="small" color="#00FFCA" style={{ marginVertical: 10 }} />
                ) : (
                  <FlatList
                    data={repayments}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    style={{ maxHeight: 150 }}
                    ListEmptyComponent={
                      <Text style={styles.emptyTextSmall}>No repayments recorded yet.</Text>
                    }
                    renderItem={({ item }) => (
                      <View style={styles.repaymentRow}>
                        <Text style={styles.repaymentText}>R {item.amount}</Text>
                        <Text style={styles.repaymentDate}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                        </Text>
                      </View>
                    )}
                  />
                )}

                <TouchableOpacity
                  style={[styles.actionButton, { marginTop: 10 }]}
                  onPress={() => setRepaymentModalVisible(true)}
                >
                  <Text style={styles.actionButtonText}>+ Add Repayment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { marginTop: 15 }]}
                  onPress={() => setSelectedLoan(null)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Repayment Modal */}
      <Modal visible={repaymentModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Record Repayment</Text>
            <Text style={styles.label}>Repayment Amount (ZAR)*</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 250"
              value={repaymentAmountInput}
              onChangeText={setRepaymentAmountInput}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setRepaymentModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddRepayment}
                disabled={isSubmittingRepayment}
              >
                <Text style={styles.modalButtonText}>
                  {isSubmittingRepayment ? "Saving..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A4D68",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#088395",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: "#051923",
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: "#088395",
  },
  tabText: {
    color: "#aaa",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  addLoanButton: {
    flexDirection: "row",
    backgroundColor: "#088395",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  refreshButton: {
    backgroundColor: "#088395",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#ccc",
    marginTop: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#051923",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#088395",
    borderWidth: 1,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardAmount: {
    color: "#00FFCA",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
  cardDetailText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#0A4D68",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#088395",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    height: 44,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  saveButton: {
    backgroundColor: "#088395",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  detailText: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#088395",
    marginVertical: 12,
  },
  sectionTitle: {
    color: "#00FFCA",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  repaymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  repaymentText: {
    color: "#fff",
    fontWeight: "bold",
  },
  repaymentDate: {
    color: "#aaa",
    fontSize: 12,
  },
  emptyTextSmall: {
    color: "#ccc",
    fontStyle: "italic",
    marginVertical: 10,
  },
  actionButton: {
    backgroundColor: "#088395",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
