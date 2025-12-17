import AccountCard from "@/components/accountCard";
import AddAccountModal from "@/components/addAccountModal";
import ConfirmRemoveModal from "@/components/onConfirmModal";
import { useAccounts } from "@/contexts/AppContext";
import requestSmsPermission from "@/services/requestPermission";
import { Account, AccountTypeList, AccountTypes } from "@/types/type";
import KEYS from "@/utils/keys";
import { saveToAsyncStorage } from "@/utils/utils";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Accounts = () => {
  const { accounts, setAccounts, setCurrencyType, currencyType } =
    useAccounts();
  const [parentAccountId, setParentAccountId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [accountType, setAccountType] = useState<AccountTypeList>(
    AccountTypes[0]
  );
  const [balance, setBalance] = useState<number>(0);
  const [limit, setAccountLimit] = useState<number>(0);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [accountToRemove, setAccountToRemove] = useState<Account | null>(null);

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

  useEffect(() => {
    requestSmsPermission();
  });

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
    <SafeAreaView className="flex-1 bg-bgc_1">
      <View className="flex-1 px-6 pt-8">
        {accounts.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-tc_1 text-lg opacity-40">
              Click {" + "} to add a new card or account...
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

      <LinearGradient
        colors={["#f43f5e", "#323078"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute right-[45%] bottom-6"
        style={{ borderRadius: 50 }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
          className="w-12 h-12 rounded-full  justify-center items-center"
        >
          <Feather name="plus" size={32} color="white" />
        </TouchableOpacity>
      </LinearGradient>

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
