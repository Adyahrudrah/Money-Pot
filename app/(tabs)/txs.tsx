import { SmsMessage, Transaction } from "@/types/type";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccounts } from "../../contexts/AppContext";
import "../../global.css";
import useSmsFetcher from "../../hooks/useSmsFetcher";
import KEYS from "../../utils/keys";
import AddTransactionModal from "../components/addTransactionModal";
import EditTransactionModal from "../components/editTransactionModal";

const Index: React.FC = () => {
  const { messages, loading, error } = useSmsFetcher();
  const { accounts, transactions, currencyType, setTransactions } =
    useAccounts();

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [toggleEditModal, setToggleEditModal] = useState<boolean>(false);
  const [toggleAddTsxModal, setToggleAddTsxModal] = useState<boolean>(false);

  const processTransactions = useCallback((transactionsMsgs: SmsMessage[]) => {
    const txs: Transaction[] = [];
    for (const msg of transactionsMsgs) {
      if (msg.body.match(KEYS.FILTER_KEYS_REGEX)) {
        continue;
      }
      const amountMatch = msg.body.match(KEYS.AMOUNT_REGEX);
      const cpMatch = msg.body.match(KEYS.COUNTER_PARTY_REGEX);
      if (amountMatch) {
        const amount = parseFloat(
          amountMatch[0].replace(/,/g, "").replace(/Rs\.?/, "")
        );
        const txsType = cpMatch ? "debit" : "credit";
        const counter_party = cpMatch ? cpMatch[0] : "Received";

        txs.push({
          message_body: msg.body,
          id: msg.date,
          type: txsType,
          amount: amount,
          date: msg.date,
          counter_party,
          account_id: msg.account_id,
        });
      }
    }
    return txs;
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      if (accounts && accounts.length > 0 && messages.length > 0) {
        const transactionMessages: SmsMessage[] = messages.flatMap(
          (message) => {
            const matchingAccount = accounts.find((acc) => {
              return (
                message.body.includes(acc.id) && message.date > acc.added_date
              );
            });
            if (!matchingAccount) return [];
            return [{ ...message, account_id: matchingAccount.id }];
          }
        );

        if (transactionMessages) {
          const processedNewTxs = processTransactions(transactionMessages);
          setTransactions(processedNewTxs);
        }
      }
    };
    initialLoad();
  }, [accounts, messages, processTransactions, setTransactions]);

  const renderMessage = ({ item }: { item: Transaction }) => {
    const isDebit = item.type === "debit";

    return (
      <Pressable
        onPress={() => {
          setSelectedTransaction(item);
          setToggleEditModal(true);
        }}
      >
        <View className="flex-row items-center justify-between p-4 mb-4 bg-bgc_2 rounded-2xl border border-bc_1 shadow-sm mx-4 text-tc_1">
          <View className="flex-row items-center flex-1">
            {/* Initial Avatar */}
            <View className="w-10 h-10 rounded-full  bg-bgc_1 items-center justify-center">
              <Text className="font-bold text-sm text-tc_1">
                {(item.counter_party || "?").charAt(0).toUpperCase()}
              </Text>
            </View>

            <View className="ml-3 flex-1">
              <Text
                className="text-tc_1 font-bold text-[15px] leading-tight"
                numberOfLines={1}
              >
                {item.counter_party}
              </Text>
              {item.date && (
                <Text className="text-tc_1 opacity-60 text-xs mt-1">
                  {new Date(item.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </Text>
              )}
            </View>
          </View>

          {item.amount && (
            <View className="items-end ml-2">
              <Text
                className={`font-bold text-xl ${isDebit ? "text-error" : "text-success"}`}
              >
                {isDebit ? "-" : "+"}
                {currencyType.sign}
                {item.amount.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-bgc_1">
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-tc_1">
            Recent Transactions
          </Text>
        </View>

        {loading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#f43f5e" />
          </View>
        )}

        {error && (
          <View className="p-4 items-center">
            <Feather name="alert-triangle" size={32} color="red" />
            <Text className="text-error mt-2">Error loading messages</Text>
          </View>
        )}

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            !loading ? (
              <View className="mt-[80%]">
                <Text className="text-center text-text_primary opacity-40">
                  No transactions found
                </Text>
              </View>
            ) : null
          }
        />

        {toggleEditModal && (
          <EditTransactionModal
            transaction={selectedTransaction}
            onClose={() => setToggleEditModal(false)}
          />
        )}
      </SafeAreaView>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setToggleAddTsxModal(true)}
        className="absolute right-[45%] bottom-6 w-12 h-12 rounded-full bg-accent justify-center items-center shadow-lg shadow-black/50"
        style={{ elevation: 1 }}
      >
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>
      <AddTransactionModal
        accounts={accounts}
        onClose={() => setToggleAddTsxModal(false)}
        isVisible={toggleAddTsxModal}
      />
    </GestureHandlerRootView>
  );
};

export default Index;
