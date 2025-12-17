import { AccountTypeList } from "@/types/type";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

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
  <View className="mb-4 bg-zinc-800 rounded-xl p-2">
    <Animated.FlatList
      data={accountTypes}
      keyExtractor={(item) => item.name}
      horizontal
      showsHorizontalScrollIndicator={false}
      itemLayoutAnimation={LinearTransition.springify().duration(400)}
      style={{ maxHeight: 200 }}
      renderItem={({ item }) => (
        <Animated.View layout={LinearTransition.springify().duration(400)}>
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
        </Animated.View>
      )}
    />
  </View>
);

export default AccountTypeSelector;
