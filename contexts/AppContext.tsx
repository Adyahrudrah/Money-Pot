import { Account, Currency, Transaction, currencies } from "@/types/type";
import KEYS from "@/utils/keys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AccountContextType {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  transactions: Transaction[] | null;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currencyType: Currency;
  setCurrencyType: (c: Currency) => void;
  loading: boolean;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currencyType, setCurrencyTypeState] = useState<Currency>(
    currencies[0]
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(KEYS.USER_ACCOUNTS_LS);
      const storedCurr = await AsyncStorage.getItem(KEYS.CURRENCY_TYPE_LS);
      if (stored) {
        const parsedAccounts: Account[] = JSON.parse(stored);
        setAccounts(parsedAccounts);
        if (storedCurr) {
          const found = currencies.find((c) => c.sign === storedCurr);
          if (found) setCurrencyTypeState(found);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(KEYS.USER_ACCOUNTS_LS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (transactions.length > 0) {
      AsyncStorage.setItem(KEYS.TRANSACTIONS_LS, JSON.stringify(transactions));
    }
  }, [transactions]);

  const setCurrencyType = (c: Currency) => {
    setCurrencyTypeState(c);
    AsyncStorage.setItem(KEYS.CURRENCY_TYPE_LS, c.sign);
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        transactions,
        setTransactions,
        setAccounts,
        currencyType,
        setCurrencyType,
        loading,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountContext);
  if (!context)
    throw new Error("useAccounts must be used within AccountProvider");
  return context;
};
