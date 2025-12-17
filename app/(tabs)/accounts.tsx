import {
  Account,
  AccountTypeList,
  AccountTypes,
  currencies,
  Currency,
} from "@/types/type";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountCard from "../components/accountCard";
import AddAccountModal from "../components/addAccountModal";
import ConfirmRemoveModal from "../components/onConfirmModal";
import { useAccounts } from "../contexts/AppContext";
import KEYS from "../utils/keys";
import { saveToAsyncStorage } from "../utils/utils";

const Accounts = () => {
  const { accounts, setAccounts, transactions } = useAccounts();
  const [parentAccountId, setParentAccountId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [accountType, setAccountType] = useState<AccountTypeList>(
    AccountTypes[0]
  );
  const [balance, setBalance] = useState<number>(0);
  const [limit, setAccountLimit] = useState<number>(0);
  const [currencyType, setCurrencyType] = useState<Currency>(currencies[0]);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [accountToRemove, setAccountToRemove] = useState<Account | null>(null);

  const loadAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem(KEYS.USER_ACCOUNTS_LS);
      if (storedAccounts !== null) {
        const parsedAccounts: Account[] = JSON.parse(storedAccounts);
        if (parsedAccounts.length > 0) {
          if (transactions) {
            const updatedAccounts = parsedAccounts.map((acc) => ({
              ...acc,
              transactions: transactions.filter(
                (txs) => txs.account_id === acc.id
              ),
            }));
            setAccounts(updatedAccounts);
          } else {
            setAccounts(parsedAccounts);
          }
          setCurrencyType(parsedAccounts[0].currency_type);
        }
      }
    } catch (e) {
      console.error("Failed to load accounts:", e);
    }
  };

  useEffect(() => {
    if (parentAccountId) {
      const parentAccount = accounts.find(
        (account) => account.id === parentAccountId
      );
      if (parentAccount) {
        setBalance(parentAccount.balance);
      }
    } else {
      setBalance(0);
    }
  }, [parentAccountId]);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    saveToAsyncStorage(KEYS.USER_ACCOUNTS_LS, JSON.stringify(accounts));
  }, [accounts]);

  const handleAddAccount = () => {
    if (id && balance && currencyType && accountType && accountName) {
      saveToAsyncStorage(KEYS.CURRENCY_TYPE_LS, currencyType.sign);
      const newAccount: Account = {
        id,
        account_name: accountName,
        account_type: accountType,
        balance,
        currency_type: currencyType,
        added_date: Date.now(),
        parent_account_id: parentAccountId,
        transactions: [],
        limit: limit ? limit : null,
      };
      const isExistingAccount = accounts.find((acc) => acc.id === id);
      if (!isExistingAccount) {
        setAccounts((prevAccounts) => [...prevAccounts, newAccount]);
      } else {
        setAccounts((prevAccounts) => {
          const accountToUpdate = prevAccounts.find(
            (acc) => acc.id === isExistingAccount.id
          );

          if (accountToUpdate) {
            const newAccount: Account = {
              id: accountToUpdate.id,
              account_name: accountName,
              account_type: accountType,
              balance,
              added_date: accountToUpdate.added_date,
              currency_type: currencyType,
              parent_account_id: parentAccountId,
              transactions: [],
              limit: limit ? limit : accountToUpdate.limit,
            };
            return [...prevAccounts].map((acc) =>
              acc.id === newAccount.id ? newAccount : acc
            );
          } else {
            return prevAccounts;
          }
        });
      }
      setModalVisible(false);
      setId("");
      setAccountName("");
      setBalance(0);
      setAccountLimit(0);
    }
  };

  const handleEditAccount = (account: Account) => {
    setModalVisible(true);
    setId(account.id);
    setAccountName(account.account_name);
    setAccountType(account.account_type);
    setBalance(account.balance);
    setParentAccountId(account.parent_account_id);
    if (account.limit) {
      setAccountLimit(account.limit);
    }
  };

  const handleRemoveAccountRequest = (account: Account) => {
    setAccountToRemove(account);
    setIsConfirmModalVisible(true);
  };

  // NEW: Function to execute the removal after confirmation
  const handleConfirmRemove = () => {
    if (accountToRemove) {
      const availableAccounts = accounts.filter(
        (acc) => acc.id !== accountToRemove.id
      );
      setAccounts(availableAccounts);
    }

    setAccountToRemove(null);
    setIsConfirmModalVisible(false);
  };

  // NEW: Function to cancel the removal
  const handleCancelRemove = () => {
    setAccountToRemove(null);
    setIsConfirmModalVisible(false);
  };

  // UPDATED: renderAccountCard now passes the request function
  const renderAccountCard = ({ item }: { item: Account }) => (
    <AccountCard
      item={item}
      handleEditAccount={handleEditAccount}
      handleRemoveAccount={handleRemoveAccountRequest}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-bg_primary">
      <View className="flex-1 px-6 pt-8">
        {accounts.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-text_primary text-lg">
              Your accounts will appear here...
            </Text>
          </View>
        ) : (
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.id}
            renderItem={renderAccountCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        className="absolute right-6 bottom-6 w-12 h-12 rounded-full bg-accent justify-center items-center shadow-lg shadow-black/50"
        style={{ elevation: 1 }}
      >
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      <AddAccountModal
        parentAccount={parentAccountId}
        handleParentAccountSelect={(value) => setParentAccountId(value)}
        accounts={accounts}
        modalVisible={modalVisible}
        handleModalVisibility={(value) => setModalVisible(value)}
        id={id}
        handleId={(value) => setId(value)}
        accountName={accountName}
        handleAccountName={(value) => setAccountName(value)}
        balance={balance}
        handleBalance={(value) => setBalance(value)}
        limit={limit}
        handleLimit={(value) => setAccountLimit(value)}
        accountType={accountType}
        handleAccountType={(value) => setAccountType(value)}
        currencyType={currencyType}
        handleCurrency={(value) => setCurrencyType(value)}
        handleAddAccount={handleAddAccount}
      />
      {accountToRemove && (
        <ConfirmRemoveModal
          isVisible={isConfirmModalVisible}
          accountName={accountToRemove.id}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}
    </SafeAreaView>
  );
};

export default Accounts;
