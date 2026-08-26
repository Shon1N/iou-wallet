import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import UserDTO from "../dtos/user-dto";
import stateService from "../services/state-service";
import UserService from "../services/user-service";

type UserSelectProps = {
  selectedUser: UserDTO | null;
  onSelectUser: (user: UserDTO) => void;
  placeholder?: string;
  label?: string;
};

export default function UserSelect({
  selectedUser,
  onSelectUser,
  placeholder = "Select a user...",
  label,
}: Readonly<UserSelectProps>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentUserId = stateService.auth?.id || "";

  useEffect(() => {
    if (modalVisible) {
      searchUsers(searchQuery);
    }
  }, [modalVisible, searchQuery]);

  const searchUsers = async (query: string) => {
    setIsLoading(true);
    const envelope = await UserService.GetAllByFilteredAsync(0, 30, query);
    setIsLoading(false);

    if (envelope.statusCode === 200 && Array.isArray(envelope.data)) {
      // Filter out current user
      const filtered = (envelope.data as UserDTO[]).filter(
        (u) => u.id !== currentUserId
      );
      setUsers(filtered);
    } else {
      setUsers([]);
    }
  };

  const handleSelect = (user: UserDTO) => {
    onSelectUser(user);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectContent}>
          <Ionicons name="person-outline" size={20} color="#088395" />
          <Text
            style={[
              styles.selectText,
              !selectedUser && styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {selectedUser
              ? `@${selectedUser.username} (${selectedUser.publicName || selectedUser.username})`
              : placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search & Select User</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Type username or name..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#666" />
                </TouchableOpacity>
              )}
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#00FFCA" />
                <Text style={styles.loadingText}>Searching users...</Text>
              </View>
            ) : (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      No users found matching "{searchQuery}"
                    </Text>
                  </View>
                }
                renderItem={({ item }) => {
                  const isSelected = selectedUser?.id === item.id;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.userItem,
                        isSelected && styles.selectedUserItem,
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      <View style={styles.userInfo}>
                        <Ionicons
                          name="person-circle-outline"
                          size={36}
                          color={isSelected ? "#00FFCA" : "#088395"}
                        />
                        <View style={styles.userTextContainer}>
                          <Text style={styles.usernameText}>
                            @{item.username}
                          </Text>
                          <Text style={styles.publicNameText}>
                            {item.publicName || item.email}
                          </Text>
                        </View>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={22} color="#00FFCA" />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
  },
  selectBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#088395",
    borderWidth: 1,
  },
  selectContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  selectText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  placeholderText: {
    color: "#888",
    fontWeight: "normal",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#0A4D68",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#088395",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: "#000",
    fontSize: 15,
  },
  loadingContainer: {
    padding: 30,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#ccc",
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 10,
  },
  emptyContainer: {
    padding: 25,
    alignItems: "center",
  },
  emptyText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#051923",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedUserItem: {
    borderColor: "#00FFCA",
    backgroundColor: "#08415c",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  userTextContainer: {
    flex: 1,
  },
  usernameText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  publicNameText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
});
