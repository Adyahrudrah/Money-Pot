import { AccountTypeList } from "@/types/type";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface AccountTypeSelectorProps {
  currentAccountType: AccountTypeList;
  onSelect: (account_type: AccountTypeList) => void;
  accountTypes: AccountTypeList[];
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({
  currentAccountType,
  onSelect,
  accountTypes,
}) => (
  <View className="mb-6 bg-zinc-800 rounded-xl p-2">
    <FlatList
      data={accountTypes}
      keyExtractor={(item) => item.name}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ maxHeight: 200 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelect(item)}
          className={`py-3 px-4 my-1 rounded-lg border mr-2 flex-row justify-between items-center ${
            currentAccountType.name === item.name
              ? "bg-accent border-accent"
              : "border-zinc-700"
          }`}
        >
          <Text className="text-white font-medium">{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

export default AccountTypeSelector;
