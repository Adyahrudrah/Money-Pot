import {
  Account,
  AccountTypeList,
  AccountTypes,
  currencies,
  Currency,
} from "@/types/type";
import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import AccountSelector from "./accountSelector";
import AccountTypeSelector from "./accountTypeSelector";
import CurrencySelector from "./currencySelector";

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
  balance: string;
  handleBalance: (value: string) => void;
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
    <Modal visible={modalVisible} transparent animationType="slide">
      <View className="flex-1 bg-primary justify-end">
        <View className="bg-zinc-900 rounded-t-3xl p-6">
          <Text className="text-text_primary text-2xl font-bold mb-6">
            Add New Account
          </Text>

          <TextInput
            placeholder="Last 4 digits"
            placeholderTextColor="#71717a"
            value={id}
            onChangeText={handleId}
            keyboardType="numeric"
            maxLength={4}
            className="bg-zinc-800 text-text_primary rounded-xl px-4 py-4 mb-4"
          />

          <TextInput
            placeholder="Bank or Card Provider Name.."
            placeholderTextColor="#71717a"
            value={accountName}
            onChangeText={handleAccountName}
            keyboardType="default"
            className="bg-zinc-800 text-text_primary rounded-xl px-4 py-4 mb-4"
          />

          <TextInput
            placeholder="Initial balance"
            placeholderTextColor="#71717a"
            value={balance}
            onChangeText={handleBalance}
            keyboardType="decimal-pad"
            className="bg-zinc-800 text-text_primary rounded-xl px-4 py-4 mb-4"
          />

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

          <AccountTypeSelector
            currentAccountType={accountType}
            onSelect={handleAccountType}
            accountTypes={AccountTypes}
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
      </View>
    </Modal>
  );
};

export default AddAccountModal;
