import { Currency } from "@/types/type";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

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
    <Animated.FlatList
      data={currencies}
      keyExtractor={(item) => item.name}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ maxHeight: 200 }}
      itemLayoutAnimation={LinearTransition.springify().duration(400)}
      renderItem={({ item }) => (
        <Animated.View layout={LinearTransition.springify().duration(400)}>
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
        </Animated.View>
      )}
    />
  </View>
);

export default CurrencySelector;
