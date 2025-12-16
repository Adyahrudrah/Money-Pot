import { Currency } from "@/types/type";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface CurrencySelectorProps {
  currentCurrency: Currency;
  onSelect: (currency: Currency) => void;
  currencies: Currency[];
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onSelect,
  currencies,
}) => (
  <View className="mb-6 bg-zinc-800 rounded-xl p-2">
    <FlatList
      data={currencies}
      keyExtractor={(item) => item.name}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ maxHeight: 200 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelect(item)}
          className={`py-3 px-4 my-1 mr-2 rounded-lg border flex-row justify-between items-center ${
            currentCurrency.name === item.name
              ? "bg-accent border-accent"
              : "border-zinc-700"
          }`}
        >
          <Text className="text-white font-medium">
            {item.sign} {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

export default CurrencySelector;
