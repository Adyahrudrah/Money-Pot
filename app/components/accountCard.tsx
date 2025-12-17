import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAccounts } from "../../contexts/AppContext";
import { Account } from "../../types/type";

interface AccountCardProps {
  item: Account;
  handleEditAccount: (account: Account) => void;
  handleRemoveAccount: (account: Account) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  item,
  handleEditAccount,
  handleRemoveAccount,
}: AccountCardProps) => {
  const [currnetBalance, setCurrentBalance] = useState<number>(0);
  const { transactions } = useAccounts();
  useEffect(() => {
    const debits = transactions?.filter(
      (txs) => txs.account_id === item.id && txs.type === "debit"
    );
    const credits = transactions?.filter(
      (txs) => txs.account_id === item.id && txs.type === "credit"
    );
    if (debits) {
      setCurrentBalance(
        item.balance - debits.reduce((acc, i) => acc + i.amount, 0)
      );
    }
    if (credits) {
      setCurrentBalance(
        (prevBalance) =>
          prevBalance + credits.reduce((acc, i) => acc + i.amount, 0)
      );
    }
  }, [item]);
  return (
    <View className="mb-6">
      <LinearGradient
        colors={["#f43f5e", "#323078"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="p-2 shadow-lg"
        style={{ elevation: 8, borderRadius: 20 }}
      >
        <View className="absolute top-6 left-6">
          <Feather name="cpu" size={40} color="#fbbf24" />
        </View>

        <Text className="absolute top-6 right-6 text-tc_1 text-2xl tracking-widest">
          **** **** {item.id}
        </Text>

        <View className="flex-row justify-between mt-20">
          <View>
            <Text className="text-tc_1/80 text-sm ">Balance</Text>
            <Text className="text-tc_1 text-xl font-bold ">
              {item.currency_type.sign} {currnetBalance.toLocaleString()}
            </Text>
            {item.limit && !isNaN(item.limit) && (
              <Text className="text-tc_1 text-xs font-bold ">
                {`- ${item.currency_type.sign} ${(item.limit - currnetBalance).toLocaleString()}`}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-tc_1 text-md">
              {item.account_name} {item.account_type.name}
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => {
                  handleRemoveAccount(item);
                }}
              >
                <MaterialCommunityIcons name="credit-card-remove" size={32} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleEditAccount(item);
                }}
              >
                <MaterialCommunityIcons name="credit-card-edit" size={32} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
export default AccountCard;
