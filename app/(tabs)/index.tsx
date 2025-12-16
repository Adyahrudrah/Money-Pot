// App.tsx
import { EvilIcons, Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
// Import Text here
import { Account, SmsMessage } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import useSmsFetcher from "../hooks/useSmsFetcher";
import { USER_ACCOUNTS_LS } from "../utils/keys";

const Index: React.FC = () => {
  const { messages, loading, error } = useSmsFetcher();

  const [transactions, setTransactions] = useState<SmsMessage[] | null>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  const loadAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem(USER_ACCOUNTS_LS);
      if (storedAccounts !== null) {
        const parsedAccounts = JSON.parse(storedAccounts);
        if (parsedAccounts.length > 0) {
          setAccounts(parsedAccounts);
        }
      }
    } catch (e) {
      console.error("Failed to load accounts:", e);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      const transactions = messages.filter((message) => {
        return accounts.some((account) => {
          return message.body.includes(account.id);
        });
      });
      setTransactions(transactions);
    }
  }, [accounts, messages]);

  const renderMessage = ({ item }: { item: SmsMessage }) => (
    <View>
      <Text className="text-text_primary">{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-bg_primary text-text_primary">
      {loading && <EvilIcons name="spinner" size={32} color="white" />}
      {error && <Feather name="alert-triangle" size={32} color="red" />}
      {transactions && (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderMessage}
        />
      )}
    </SafeAreaView>
  );
};

export default Index;
