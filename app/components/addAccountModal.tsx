import {
  Account,
  AccountTypeList,
  AccountTypes,
  currencies,
  Currency,
} from "@/types/type";
import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountTypeSelector from "./accountTypeSelector";
import CurrencySelector from "./currencySelector";
import AccountSelector from "./parentAccSelector";

interface AddAccountModalProps {
  parentAccount: string | null;
  handleParentAccountSelect: (value: string | null) => void;
  accounts: Account[];
  modalVisible: boolean;
  handleModalVisibility: (value: boolean) => void;
  id: string;
  handleId: (value: string) => void;
  accountName: string;
  handleAccountName: (value: string) => void;
  balance: number;
  handleBalance: (value: number) => void;
  limit: number;
  handleLimit: (value: number) => void;
  currencyType: Currency;
  handleCurrency: (currency: Currency) => void;
  accountType: AccountTypeList;
  handleAccountType: (accountType: AccountTypeList) => void;
  handleAddAccount: () => void;
}

const AddAccountModal = ({
  handleParentAccountSelect,
  parentAccount,
  accounts,
  modalVisible,
  handleModalVisibility,
  balance,
  handleBalance,
  limit,
  handleLimit,
  id,
  handleId,
  accountName,
  handleAccountName,
  currencyType,
  handleCurrency,
  accountType,
  handleAccountType,
  handleAddAccount,
}: AddAccountModalProps) => {
  const sortedCurrencies = React.useMemo(() => {
    const list = [...currencies];
    list.sort((a, b) => {
      if (a.name === currencyType.name) {
        return -1;
      }
      if (b.name === currencyType.name) {
        return 1;
      }
      return 0;
    });

    return list;
  }, [currencyType]);

  return (
    <Modal visible={modalVisible} transparent={false} animationType="slide">
      <SafeAreaView className="flex-1 bg-primary justify-start bg-bg_primary">
        <View className="rounded-t-3xl p-4">
          <Text className="text-text_primary text-2xl font-bold mb-4">
            Add New Account
          </Text>

          <AccountTypeSelector
            currentAccountType={accountType}
            onSelect={handleAccountType}
            accountTypes={AccountTypes}
          />

          {accountType.value === "credit-card" && (
            <View className="flex-row items-center">
              <Text className="flex-1 text-text_primary font-bold">
                Card Limit
              </Text>
              <TextInput
                placeholder="Credit limit"
                placeholderTextColor="#71717a"
                value={limit?.toString()}
                onChangeText={(value) =>
                  handleLimit(
                    parseFloat(isNaN(parseFloat(value)) ? "0" : value)
                  )
                }
                keyboardType="decimal-pad"
                className="flex-1 bg-zinc-800 text-text_primary rounded-xl px-4 py-4 mb-4"
              />
            </View>
          )}

          <View className="flex-row items-center mb-4">
            <Text className="flex-1 text-text_primary font-bold">
              Current Balance
            </Text>
            <TextInput
              placeholder="Current balance"
              placeholderTextColor="#71717a"
              value={balance.toString()}
              onChangeText={(value) =>
                handleBalance(
                  parseFloat(isNaN(parseFloat(value)) ? "0" : value)
                )
              }
              keyboardType="decimal-pad"
              className="flex-1 bg-zinc-800 text-text_primary rounded-xl px-4 py-4"
            />
          </View>

          <View className="flex-row gap-2">
            <TextInput
              placeholder="Last 4 digits"
              placeholderTextColor="#71717a"
              value={id}
              onChangeText={handleId}
              keyboardType="numeric"
              maxLength={4}
              className="flex-2 bg-zinc-800 text-text_primary rounded-xl px-4 py-4 mb-4"
            />

            <TextInput
              placeholder="Bank Name"
              placeholderTextColor="#71717a"
              value={accountName}
              onChangeText={handleAccountName}
              keyboardType="default"
              className="flex-1 bg-zinc-800 text-text_primary rounded-xl px-4 py-4 mb-4"
            />
          </View>

          {accounts.length > 0 && (
            <AccountSelector
              currentAccountId={parentAccount}
              onSelect={handleParentAccountSelect}
              accounts={accounts}
            />
          )}
          <CurrencySelector
            currentCurrency={currencyType}
            onSelect={handleCurrency}
            currencies={sortedCurrencies}
          />

          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => handleModalVisibility(false)}
              className="flex-1 bg-zinc-800 py-4 rounded-xl"
            >
              <Text className="text-text_primary text-center font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddAccount}
              className="flex-1 bg-accent py-4 rounded-xl"
            >
              <Text className="text-text_primary text-center font-semibold">
                Add Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddAccountModal;
