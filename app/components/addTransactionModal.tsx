import {
  Account,
  credit_categories,
  debit_categories,
  Transaction,
} from "@/types/type";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
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
import { useAccounts } from "../../contexts/AppContext";

interface AddTransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  accounts: Account[];
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isVisible,
  onClose,
  accounts,
}) => {
  const { setTransactions, transactions } = useAccounts();
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"debit" | "credit">("debit");
  const [counterParty, setCounterParty] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id || ""
  );

  const sortedCategories = useMemo(() => {
    const base = type === "debit" ? debit_categories : credit_categories;
    if (!category || !base.includes(category)) return base;
    return [category, ...base.filter((c) => c !== category)];
  }, [category, type]);

  const handleSave = () => {
    if (!amount || !counterParty || !category || !selectedAccountId) return;

    const now = Date.now();
    const newTransaction: Transaction = {
      id: now,
      date: now,
      amount,
      type,
      counter_party: counterParty,
      category,
      message_body: notes || `Manual ${type} entry`,
      account_id: selectedAccountId,
    };

    if (transactions) {
      setTransactions([newTransaction, ...transactions]);
    } else {
      setTransactions([newTransaction]);
    }

    setAmount(0);
    setCounterParty("");
    setCategory("");
    setNotes("");
    onClose();
  };

  return (
    <Modal transparent animationType="slide" visible={isVisible}>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-bgc_2 rounded-t-3xl p-6 max-h-[100%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-tc_1 text-2xl font-bold">
                Add Transaction
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#71717a" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* ACCOUNT SELECTOR */}
              <Text className="text-tc_1 font-semibold mb-2 ml-1">
                Select Account
              </Text>
              <Animated.FlatList
                data={accounts}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                className="mb-6"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedAccountId(item.id)}
                    className={`mr-3 p-4 rounded-2xl border ${
                      selectedAccountId === item.id
                        ? "bg-accent border-accent"
                        : "bg-bgc_3 border-zinc-700"
                    }`}
                  >
                    <Text
                      className={`font-bold ${selectedAccountId === item.id ? "text-white" : "text-tc_1"}`}
                    >
                      {item.account_name}
                    </Text>
                    <Text
                      className={`text-xs ${selectedAccountId === item.id ? "text-white" : "text-tc_1"}`}
                    >
                      {item.account_type.name} **** **** {item.id}
                    </Text>
                  </TouchableOpacity>
                )}
              />

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
                placeholder="0.00"
                placeholderTextColor="#71717a"
                onChangeText={(value) => setAmount(parseFloat(value) || 0)}
                keyboardType="decimal-pad"
                className="bg-bgc_3 text-tc_1 rounded-xl px-4 py-4 mb-4 text-xl font-bold"
              />

              {/* CATEGORY SELECTOR */}
              <Text className="text-tc_1 font-semibold mb-2 ml-1">
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row mb-4"
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
                placeholder="Receiver or Sender name"
                placeholderTextColor="#71717a"
                value={counterParty}
                onChangeText={setCounterParty}
                className="bg-bgc_3 text-tc_1 rounded-xl px-4 py-4 mb-4"
              />

              <Text className="text-tc_1 font-semibold mb-2 ml-1">Notes</Text>
              <TextInput
                placeholder="Optional description..."
                placeholderTextColor="#71717a"
                value={notes}
                onChangeText={setNotes}
                multiline
                className="bg-bgc_3 text-tc_1 rounded-xl px-4 py-4 mb-4 min-h-[80px]"
                textAlignVertical="top"
              />
            </ScrollView>

            <View className="flex-row gap-4 mt-2">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-bgc_3 py-4 rounded-xl"
              >
                <Text className="text-tc_1 text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className={`flex-1 py-4 rounded-xl ${!amount || !counterParty || !category || !selectedAccountId ? "bg-zinc-700" : "bg-accent"}`}
                disabled={
                  !amount || !counterParty || !category || !selectedAccountId
                }
              >
                <Text className="text-white text-center font-semibold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddTransactionModal;
