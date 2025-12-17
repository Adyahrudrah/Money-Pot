import { credit_categories, debit_categories, Transaction } from "@/types/type";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccounts } from "../contexts/AppContext";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  const { setTransactions } = useAccounts();
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"debit" | "credit">("debit");
  const [counterParty, setCounterParty] = useState("");
  const [category, setCategory] = useState("");
  const availableCategories =
    type === "debit" ? debit_categories : credit_categories;

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
    setTransactions((prevTransactions) =>
      prevTransactions.map((tsx) =>
        tsx.id === transaction.id
          ? {
              ...transaction,
              category,
              amount,
              type,
              counter_party: counterParty,
            }
          : tsx
      )
    );
    onClose();
  };

  return (
    <Modal transparent animationType="slide">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-bg_secondary rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-bg_primary text-2xl font-bold">
                Edit Detail
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#71717a" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* TYPE TOGGLE */}
              <View className="flex-row bg-bg_tertiary rounded-2xl p-1.5 mb-6">
                <TouchableOpacity
                  onPress={() => {
                    setType("debit");
                    setCategory("");
                  }} // Clear category if type changes
                  className={`flex-1 py-3 rounded-xl items-center ${type === "debit" ? "bg-bg_secondary" : ""}`}
                >
                  <Text
                    className={`font-bold ${type === "debit" ? "text-error" : "text-gray-500"}`}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setType("credit");
                    setCategory("");
                  }}
                  className={`flex-1 py-3 rounded-xl items-center ${type === "credit" ? "bg-bg_secondary" : ""}`}
                >
                  <Text
                    className={`font-bold ${type === "credit" ? "text-success" : "text-gray-500"}`}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="text-bg_primary font-semibold mb-2 ml-1">
                Amount
              </Text>
              <TextInput
                value={amount.toString()}
                onChangeText={(value) => setAmount(parseFloat(value))}
                keyboardType="decimal-pad"
                className="bg-bg_tertiary text-bg_primary rounded-xl px-4 py-4 mb-4 text-xl font-bold"
              />

              {/* CATEGORY SELECTOR (Dropdown style) */}
              <Text className="text-bg_primary font-semibold mb-2 ml-1">
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row mb-4"
              >
                {availableCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`mr-2 px-4 py-2 rounded-full border ${
                      category === cat
                        ? "bg-accent border-accent"
                        : "bg-bg_tertiary border-zinc-700"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${category === cat ? "text-white" : "text-bg_primary"}`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text className="text-bg_primary font-semibold mb-2 ml-1">
                Counter Party
              </Text>
              <TextInput
                value={counterParty}
                onChangeText={setCounterParty}
                className="bg-bg_tertiary text-bg_primary rounded-xl px-4 py-4 mb-4"
              />

              <Text className="text-bg_primary font-semibold mb-2 ml-1">
                Message
              </Text>
              <Text>{transaction?.message_body}</Text>
            </ScrollView>

            <View className="flex-row gap-4 mt-2">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-bg_tertiary py-4 rounded-xl"
              >
                <Text className="text-bg_primary text-center font-semibold">
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
