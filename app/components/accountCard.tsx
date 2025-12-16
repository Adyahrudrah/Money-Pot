import { Account } from "@/types/type";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
  useEffect(() => {
    const debits = item.transactions?.filter((txs) => txs.type === "debit");
    const credits = item.transactions?.filter((txs) => txs.type === "credit");
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

        <Text className="absolute top-6 right-6 text-text_primary text-2xl tracking-widest">
          **** **** {item.id}
        </Text>

        <View className="flex-row justify-between mt-20">
          <View>
            <Text className="text-text_primary/80 text-sm ">Balance</Text>
            <Text className="text-text_primary text-xl font-bold ">
              {item.currency_type.sign} {currnetBalance.toLocaleString()}
            </Text>
            {item.limit && !isNaN(item.limit) && (
              <Text className="text-text_primary text-xs font-bold ">
                {`- ${item.currency_type.sign} ${(item.limit - currnetBalance).toLocaleString()}`}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-text_primary text-md">
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
