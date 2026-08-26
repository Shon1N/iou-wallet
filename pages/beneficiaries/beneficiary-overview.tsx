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
    TouchableOpacity,
    View
} from "react-native";
import UserSelect from "../../components/user-select";
import BeneficiaryDTO from "../../dtos/beneficiary-dto";
import UserDTO from "../../dtos/user-dto";
import BeneficiaryService from "../../services/beneficiary-service";
import stateService from "../../services/state-service";

export default function BeneficiaryOverview() {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [benTypeIdInput] = useState("00000000-0000-0000-0000-000000000001");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId = stateService.auth?.id || "";

  useEffect(() => {
    if (currentUserId) {
      loadBeneficiaries();
    }
  }, [currentUserId]);

  const loadBeneficiaries = async () => {
    if (!currentUserId) return;
    setIsLoading(true);
    const envelope = await BeneficiaryService.GetAllByUserIdAsync(currentUserId);
    setIsLoading(false);
    if (envelope.statusCode === 200 && Array.isArray(envelope.data)) {
      setBeneficiaries(envelope.data);
    } else {
      setBeneficiaries([]);
    }
  };

  const handleAddBeneficiary = async () => {
    if (!selectedUser) {
      Alert.alert("Error", "Please search and select a beneficiary user.");
      return;
    }

    setIsSubmitting(true);
    const newBeneficiary: BeneficiaryDTO = {
      userId: currentUserId,
      benUserId: selectedUser.id,
      benTypeId: benTypeIdInput.trim(),
      isActive: true,
    };

    const envelope = await BeneficiaryService.CreateAsync(newBeneficiary);
    setIsSubmitting(false);

    if (envelope.statusCode === 200 || envelope.statusCode === 201) {
      Alert.alert("Success", "Beneficiary added successfully.");
      setModalVisible(false);
      setSelectedUser(null);
      loadBeneficiaries();
    } else {
      Alert.alert("Error", envelope.message || "Failed to add beneficiary.");
    }
  };

  const handleDeleteBeneficiary = (item: BeneficiaryDTO) => {
    if (!item.id) return;
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this beneficiary?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const envelope = await BeneficiaryService.DeleteAsync(item.id!, item);
            if (envelope.statusCode === 200) {
              Alert.alert("Success", "Beneficiary removed.");
              loadBeneficiaries();
            } else {
              Alert.alert("Error", envelope.message || "Failed to delete beneficiary.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Beneficiaries</Text>
        <Text style={styles.headerSubtitle}>Manage your contacts and beneficiaries</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addBeneficiaryButton}
        >
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add Beneficiary</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={loadBeneficiaries} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00FFCA" />
        </View>
      ) : (
        <FlatList
          data={beneficiaries}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#088395" />
              <Text style={styles.emptyText}>No beneficiaries found.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Ionicons name="person-circle-outline" size={40} color="#00FFCA" />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardName}>
                    {item.benUser?.publicName || item.benUser?.username ? `@${item.benUser?.username} (${item.benUser?.publicName || ""})` : "Beneficiary"}
                  </Text>
                  <Text style={styles.cardSubText}>ID: {item.benUserId}</Text>
                  <Text style={styles.cardStatusText}>
                    Status: {item.isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteBeneficiary(item)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4924" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Add Beneficiary Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Beneficiary</Text>

            <UserSelect
              label="Select User by Username*"
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              placeholder="Search username..."
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedUser(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddBeneficiary}
                disabled={isSubmitting}
              >
                <Text style={styles.modalButtonText}>
                  {isSubmitting ? "Saving..." : "Save"}
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
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  addBeneficiaryButton: {
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
  cardName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
  cardStatusText: {
    color: "#00FFCA",
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
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
});
