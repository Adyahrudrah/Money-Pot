import { Account } from "@/types/type";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface accountSelectorProps {
  currentAccountId: string | null;
  onSelect: (account: string | null) => void;
  accounts: Account[];
}

const AccountSelector: React.FC<accountSelectorProps> = ({
  currentAccountId,
  onSelect,
  accounts,
}) => (
  <View className="mb-6 bg-dark-800 rounded-xl p-2 text-text_primary ">
    <FlatList
      data={accounts}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ maxHeight: 200 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            onSelect(item.id === currentAccountId ? null : item.id)
          }
          className={`py-3 px-4 my-1 mr-2 rounded-lg border flex-row justify-between items-center ${
            currentAccountId === item.id
              ? "bg-accent border-accent"
              : "border-zinc-700"
          }`}
        >
          <Text className="text-text_primary">
            <MaterialIcons name="merge" size={16} />
          </Text>
          <Text className="text-text_primary font-medium">{item.id}</Text>
          {currentAccountId === item.id && (
            <Text className="text-text_primary"> ( Primary Account )</Text>
          )}
        </TouchableOpacity>
      )}
    />
  </View>
);

export default AccountSelector;
