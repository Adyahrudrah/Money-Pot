import { useAccounts } from "@/contexts/AppContext";
import { credit_categories, debit_categories, Transaction } from "@/types/type";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  const { setTransactions, transactions } = useAccounts();
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"debit" | "credit">("debit");
  const [counterParty, setCounterParty] = useState(transaction?.counter_party);
  const [category, setCategory] = useState("");

  // Logic to move active category to 0 index with animation support
  const sortedCategories = useMemo(() => {
    const base = type === "debit" ? debit_categories : credit_categories;
    if (!category || !base.includes(category)) return base;
    return [category, ...base.filter((c) => c !== category)];
  }, [category, type]);

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setType(transaction.type);
      setCounterParty(transaction.counter_party || "");
      setCategory(transaction.category || "");
    }
  }, [transaction]);

  const handleUpdate = () => {
    if (!transaction || !amount || !counterParty) return;
    const updatedTransactions = transactions?.map((tsx) =>
      tsx.id === transaction.id
        ? {
            ...transaction,
            category,
            amount,
            type,
            counter_party: counterParty,
          }
        : tsx
    );
    if (updatedTransactions) {
      setTransactions(updatedTransactions);
    }
    onClose();
  };

  return (
    <Modal transparent animationType="slide" visible={!!transaction}>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-bgc_2 rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-tc_1 text-2xl font-bold">Edit Detail</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#71717a" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* TYPE TOGGLE */}
              <View className="flex-row bg-bgc_3 rounded-2xl p-1.5 mb-6">
                <TouchableOpacity
                  onPress={() => {
                    setType("debit");
                    setCategory("");
                  }}
                  className={`flex-1 py-3 rounded-xl items-center ${type === "debit" ? "bg-bgc_1" : ""}`}
                >
                  <Text
                    className={`font-bold ${type === "debit" ? "text-error" : "text-tc_1"}`}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setType("credit");
                    setCategory("");
                  }}
                  className={`flex-1 py-3 rounded-xl items-center ${type === "credit" ? "bg-bgc_1" : ""}`}
                >
                  <Text
                    className={`font-bold ${type === "credit" ? "text-success" : "text-tc_1"}`}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="text-tc_1 font-semibold mb-2 ml-1">Amount</Text>
              <TextInput
                value={amount.toString()}
                onChangeText={(value) => setAmount(parseFloat(value) || 0)}
                keyboardType="decimal-pad"
                className="bg-bgc_3 text-tc_1 rounded-xl px-4 py-4 mb-4 text-xl font-bold"
              />

              <Text className="text-tc_1 font-semibold mb-2 ml-1">
                Category {category ? "- " + category : ""}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row mb-4"
                contentContainerStyle={{ paddingVertical: 4 }}
              >
                {sortedCategories.map((cat) => (
                  <Animated.View
                    key={cat}
                    layout={LinearTransition.springify().duration(400)}
                  >
                    <TouchableOpacity
                      onPress={() => setCategory(cat)}
                      className={`mr-2 px-4 py-2 rounded-full border ${
                        category === cat
                          ? "bg-accent border-accent"
                          : "bg-bgc_3 border-zinc-700"
                      }`}
                    >
                      <Text
                        className={`text-xl font-medium ${category === cat ? "text-white" : "text-tc_1"}`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>

              <Text className="text-tc_1 font-semibold mb-2 ml-1">
                Counter Party
              </Text>
              <TextInput
                value={counterParty}
                onChangeText={setCounterParty}
                className="bg-bgc_3 text-tc_1 rounded-xl px-4 py-4 mb-4"
              />

              <Text className="text-tc_1 font-semibold mb-2 ml-1">Message</Text>
              <View className="bg-bgc_3 rounded-xl p-4">
                <Text className="text-tc_1 leading-5">
                  {transaction?.message_body}
                </Text>
              </View>
            </ScrollView>

            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-bgc_3 py-4 rounded-xl"
              >
                <Text className="text-tc_1 text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdate}
                className="flex-1 bg-accent py-4 rounded-xl"
              >
                <Text className="text-white text-center font-semibold">
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditTransactionModal;
